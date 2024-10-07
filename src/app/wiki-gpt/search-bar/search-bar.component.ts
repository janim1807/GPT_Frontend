import {Component, OnInit} from '@angular/core';
import {GptService} from "./gpt.service";
import {ChatCompletionRequestMessage} from "openai/api";
import axios from 'axios';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  chatMessages: ChatMessage[] = [];
  userInput: string = '';
  schemeQuery = "QUERY_START SELECT t.table_name, c.column_name, data_type\n" +
    "FROM information_schema.tables t\n" +
    "JOIN information_schema.columns c ON t.table_name = c.table_name AND t.table_schema = c.table_schema\n" +
    "WHERE t.table_schema = 'public'\n" +
    "ORDER BY t.table_name, c.ordinal_position; QUERY_END"
  isChecked = false;

  constructor(private gptService: GptService, private sanitizer: DomSanitizer) {
  }

  async sendMessage() {
    const userMessage: ChatMessage = {
      role: 'user',
      content: this.userInput
    };

    this.chatMessages.push(userMessage);
    this.userInput = '';

    const messagesForChatCompletion: ChatCompletionRequestMessage[] = this.chatMessages.map(message => ({
      role: message.role,
      content: message.content
    }));

    const dbSchemeResponse = await axios.post('http://localhost:5000', {data: this.schemeQuery});

    const tableHeader = '"table_name"    "column_name"   "data_type"';
    const tableSeparator = '-'.repeat(tableHeader.length);

    const tableRows = dbSchemeResponse.data.queryResult.map(([table, column, dataType]: [string, string, string]) =>
      `"${table}"          "${column}"         "${dataType}"`
    );

    const tableString = [tableHeader, tableSeparator, ...tableRows].join('\n');

    const combinedMessage = !this.isChecked ? `Du bist eine Hilfe, um für Mitarbeiter eines Energie-Versorgers (EnBW) die richtige Tabelle für ihr Anliegen zu finden. Das ist das SAP-Datenbank-Schema: ${tableString}. Bitte halte die Antwort knapp und schreibe alle Tabellen- und Spaltennamen zwischen " ".` : `Du bist eine Hilfe, um für Mitarbeiter eines Energie-Versorgers (EnBW) eine SQL Query zu generieren, die ein Python-Skript dann auf der SAP-Datenbank ausführt. Eine Beispielfrage wäre, welche Informationen du über den Kunden John Doe hast. Auf diese Frage sollst du eine SQL-Query generieren, aber nur spezifische SQL-Queries, keine allgemeinen. Die Applikation hat zusätzlich ein Backend, das mit der Datenbank verbunden ist, daher, wenn du eine SQL-Query generierst, schreibe davor QUERY_START und danach QUERY_END. Das ist das SAP-Datenbank-Schema: ${tableString} `

    try {
      const response = await this.gptService.createChatCompletion([
        {role: 'system', content: combinedMessage},
        ...messagesForChatCompletion,
      ]);


      const botResponse = response.data.choices?.[0]?.message?.content ?? '';

      if (botResponse && botResponse.includes('QUERY_START') && botResponse.includes('QUERY_END')) {

        const dbQueryResponse = await axios.post('http://localhost:5000', {data: botResponse});

        const lastUserMessage = messagesForChatCompletion[messagesForChatCompletion.length - 1].content;
        const queryExplainer = `Dies ist das Ergebnis der Query: ${dbQueryResponse.data.queryResult}, die vom Backend ausgeführt wurde auf die letzte gestellte Frage: ${lastUserMessage}. Bitte gib das Ergebnis der Query in einer verständlichen Weise zurück erfinde nichts neues und schreibe alle Query-Answers zwischen " ".`;

        const response = await this.gptService.createChatCompletion([
          ...messagesForChatCompletion,
          {role: 'system', content: queryExplainer},
        ]);

        const botMessage: ChatMessage = {
          role: 'assistant',
          content: response.data.choices?.[0]?.message?.content ?? ''
        };
        this.chatMessages.push(botMessage);
      } else {
        const botResponse = response.data.choices?.[0]?.message?.content ?? '';
        const botMessage: ChatMessage = {
          role: 'assistant',
          content: botResponse
        };
        this.chatMessages.push(botMessage);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }


  ngOnInit()
    :
    void {
  }

  highlightWords(content: string): SafeHtml {
    const regex = /"([^"]+)"/g; // Regular expression to match words between double quotes
    const formattedContent = content.replace(
      regex,
      '<span class="bold-text">$1</span>'
    );
    return this.sanitizer.bypassSecurityTrustHtml(
      formattedContent
    );
  }
}

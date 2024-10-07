import {Injectable} from '@angular/core';
import {Configuration, OpenAIApi} from 'openai';
import {ChatCompletionRequestMessage} from 'openai/api';

@Injectable({
  providedIn: 'root'
})
export class GptService {
  private configuration = new Configuration({
    apiKey: 'XXXXXXXXXXXXXXXx',
  });

  async createChatCompletion(messages: ChatCompletionRequestMessage[]) {
    const openai = new OpenAIApi(this.configuration);
    delete this.configuration.baseOptions.headers['User-Agent'];

    return await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages
    });
  }
}

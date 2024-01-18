import { Injectable } from '@nestjs/common';

@Injectable()
export class FeedService {
  private feedList = [];

  getAllFeed() {
    return this.feedList;
  }
}

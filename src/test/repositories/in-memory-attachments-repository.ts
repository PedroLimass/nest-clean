import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = [];

  // eslint-disable-next-line @typescript-eslint/require-await
  async create(attachment: Attachment) {
    this.items.push(attachment);
  }
}

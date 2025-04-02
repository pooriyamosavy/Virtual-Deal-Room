import { UserSession } from 'src/entities/user-session.entities';
import { EventSubscriber, EntitySubscriberInterface, LoadEvent } from 'typeorm';

@EventSubscriber()
export class UserSessionSubscriber
  implements EntitySubscriberInterface<UserSession>
{
  listenTo() {
    return UserSession;
  }

  beforeLoad(entity: UserSession) {
    entity.used_at = new Date();
  }
}

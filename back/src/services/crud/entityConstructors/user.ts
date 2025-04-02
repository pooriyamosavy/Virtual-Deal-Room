import { User } from 'src/entities/user.entities';

export class ArrayUser extends Array<User> {
  constructor(users: User[]) {
    super(...users.map((user) => new User(user)));
  }
}

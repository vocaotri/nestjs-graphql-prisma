import {
  Ability,
  AbilityBuilder,
  InferSubjects,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Post } from 'src/@generated/post/post.model';
import { User } from 'src/@generated/user/user.model';
import { PermissionAction } from './enums/permission-action ';
import { Injectable } from '@nestjs/common';
import { Role } from 'y/auth/enums/role.enum';

type Subjects = InferSubjects<typeof Post | typeof User> | 'all';

export type AppAbility = Ability<[PermissionAction, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[PermissionAction, Subjects]>
    >(Ability as AbilityClass<AppAbility>);
    if (user.role === Role.Admin) {
      can(PermissionAction.Manage, 'all'); // read-write access to everything
    } else {
      can(PermissionAction.Read, 'all'); // read-only access to everything
    }

    can(PermissionAction.Update, Post, { authorId: user.id });
    cannot(PermissionAction.Delete, Post, { published: true });
    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}

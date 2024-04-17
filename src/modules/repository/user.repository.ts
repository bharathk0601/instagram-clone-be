import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, FindOptionsWhere, DataSource, Repository, UpdateResult } from 'typeorm';

import { User, TUser, UserProfile, TUserProfile, UserToken, TUserToken } from '@/shared/entities';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    @InjectRepository(UserProfile) private readonly userProfile: Repository<UserProfile>,
    @InjectRepository(UserToken) private readonly userToken: Repository<UserToken>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   *
   * @param {TUser} user
   * @param {TUserProfile} userProfile
   * @returns {Promise<boolean>}
   */
  public async signUp(user: TUser, userProfile: TUserProfile, ctx: ReqCtx): Promise<boolean> {
    let isSignUpSuccess = false;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      queryRunner.startTransaction();
      console.log(user);

      await queryRunner.manager.insert(User, user);
      userProfile.userId = user.userId;
      await queryRunner.manager.save(UserProfile, userProfile);

      await queryRunner.commitTransaction();
      isSignUpSuccess = true;
    } catch (e) {
      ctx.logger.error(e, 'UserRepository | signUp');
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return isSignUpSuccess;
  }

  /**
   *
   * @param {User} user
   * @returns {Promise<UpdateResult>}
   */
  public updateUser(condition: FindOptionsWhere<User>, user: TUser): Promise<UpdateResult> {
    return this.user.update(condition, user);
  }

  /**
   *
   * @param {FindOptionsWhere<User>} condition
   * @param {FindOptionsSelect<User>} select
   * @returns {Promise<User>}
   */
  public findUser(condition: FindOptionsWhere<User>, select: FindOptionsSelect<User>): Promise<User> {
    return this.user.findOne({
      where: condition,
      select: select,
    });
  }

  /**
   *
   * @param {TUserProfile} data
   * @returns {UserProfiles}
   */
  public createUserProfile(userProfile: TUserProfile): UserProfile {
    return this.userProfile.create(userProfile);
  }

  /**
   *
   * @param {TUserToken} userToken
   * @returns {Promise<UserToken>}
   */
  public saveUserToken(userToken: TUserToken): Promise<UserToken> {
    return this.userToken.save(userToken);
  }

  /**
   *
   * @param {TUserToken} userToken
   * @returns {Promise<UpdateResult>}
   */
  public updateUserToken(condition: FindOptionsWhere<UserToken>, userToken: TUserToken): Promise<UpdateResult> {
    return this.userToken.update(condition, userToken);
  }

  /**
   *
   * @param {TUserToken} userToken
   * @returns {Promise<UserToken>}
   */
  public findUserToken(condition: FindOptionsWhere<UserToken>, select: FindOptionsSelect<UserToken>): Promise<UserToken> {
    return this.userToken.findOne({ where: condition, select: select });
  }
}

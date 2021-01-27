import { User } from "./user.entity";
import { RefreshToken } from "./refresh-token.entity";
import { EntityRepository, Repository } from "typeorm";

/**
 https://medium.com/javascript-in-plain-english/nestjs-implementing-access-refresh-token-jwt-authentication-97a39e448007
*/

@EntityRepository(RefreshToken)
export class RefreshTokensRepository extends Repository<RefreshToken>  {

  async createRefreshToken (user: User, lifetime: number): Promise<RefreshToken> {
    const token = new RefreshToken()

    token.userId = user.id;
    token.isRevoked = false;

    const expiration = new Date();
    expiration.setTime(expiration.getTime() + lifetime);
    token.expires = expiration

    return token.save();
  }
  async findTokenByUserId (userId: number): Promise<RefreshToken | null> {
    return await RefreshToken.findOne({ userId })
  }
  async findTokenById (id: number): Promise<RefreshToken | null> {
    return await RefreshToken.findOne({ id })
  }

  async revokeTokenForUser (userId: number): Promise<void> {
      const token = await RefreshToken.findOne({ userId });
      token.isRevoked = true;
      await token.save();
    }
}
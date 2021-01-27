import { User } from "./user.entity";
import { RefreshToken } from "./refresh-token.entity";
import { EntityRepository, Repository } from "typeorm";

/**
 https://medium.com/javascript-in-plain-english/nestjs-implementing-access-refresh-token-jwt-authentication-97a39e448007
*/

@EntityRepository(RefreshToken)
export class RefreshTokensRepository extends Repository<RefreshToken>  {

  async findTokenByUserId (userId: number): Promise<RefreshToken | null> {
    return await RefreshToken.findOne({ userId })
  }
  async findTokenById (id: number): Promise<RefreshToken | null> {
    return await RefreshToken.findOne({ id })
  }

  async revokeTokenForUser (userId: number): Promise<RefreshToken> {
      const token = await RefreshToken.findOne({ userId: userId });
      token.isRevoked = true;
      return token.save();
    }
  async revokeTokenWithId (tokenId: number): Promise<RefreshToken> {
    const token = await RefreshToken.findOne({ id: tokenId });
    token.isRevoked = true;
    return token.save();
  }
}
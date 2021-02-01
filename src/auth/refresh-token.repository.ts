import { RefreshToken } from "./refresh-token.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(RefreshToken)
export class RefreshTokensRepository extends Repository<RefreshToken>  {

  async findTokenByUserId (userId: string): Promise<RefreshToken | null> {
    return await RefreshToken.findOne({ userId })
  }
  async findTokenById (id: string): Promise<RefreshToken | null> {
    return await RefreshToken.findOne({ id })
  }

  async revokeTokenForUser (userId: string): Promise<RefreshToken> {
      const token = await this.findOne({ userId });
      if(token) {
        token.isRevoked = true;
        return token.save();
      }
      return;
    }
  async revokeTokenWithId (tokenId: string): Promise<RefreshToken> {
    const token = await RefreshToken.findOne({ id: tokenId });
    token.isRevoked = true;
    return token.save();
  }
}
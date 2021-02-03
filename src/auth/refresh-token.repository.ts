import { RefreshToken } from './refresh-token.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(RefreshToken)
export class RefreshTokensRepository extends Repository<RefreshToken> {
  async findTokenById(id: string): Promise<RefreshToken | null> {
    return await RefreshToken.findOne({ id });
  }
  async revokeTokenForUser(userId: string): Promise<RefreshToken> {
    const token = await this.findOne({ userId });
    if (token) {
      token.isRevoked = true;
      return token.save();
    }
    return;
  }
}

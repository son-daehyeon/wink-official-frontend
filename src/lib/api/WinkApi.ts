import { WinkApiRequest } from '@/lib/api/WinkApiRequest';
import { Auth } from '@/lib/api/domain/Auth';
import { User, UserAdmin } from '@/lib/api/domain/User';

export class WinkApi {
  private static instance: WinkApi | null = null;

  private readonly request = new WinkApiRequest();

  private readonly auth: Auth = new Auth(this.request);
  private readonly user: User = new User(this.request);
  private readonly userAdmin: UserAdmin = new UserAdmin(this.request);

  private constructor() {
    if (WinkApi.instance !== null) {
      throw new Error('WinkApi is already initialized');
    }

    WinkApi.instance = this;
  }

  private static get Instance(): WinkApi {
    if (WinkApi.instance === null) {
      throw new Error('WinkApi is not initialized');
    }

    return WinkApi.instance!;
  }

  public static init(): void {
    if (WinkApi.instance !== null) {
      return;
    }

    new WinkApi();
  }

  public static get Request(): WinkApiRequest {
    return WinkApi.Instance.request;
  }

  public static get Auth(): Auth {
    return WinkApi.Instance.auth;
  }

  public static get User(): User {
    return WinkApi.Instance.user;
  }

  public static get UserAdmin(): UserAdmin {
    return WinkApi.Instance.userAdmin;
  }
}

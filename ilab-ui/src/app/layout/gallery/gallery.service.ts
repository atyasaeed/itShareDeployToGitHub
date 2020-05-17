import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RestService } from 'src/app/shared/services';
import { ShoppingCartItem, Order } from 'src/app/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class GalleryService extends RestService<ShoppingCartItem> {
  resource = 'gallery';

  cloneItem(entity) {
    return this.http.post(this.appConfig.API_END_POINT + `api/gallery/${entity.id}/clone`, entity);
  }
  removeItem(entityId) {
    return this.http.delete(this.appConfig.API_END_POINT + `api/admin/gallery/${entityId}`);
  }
}

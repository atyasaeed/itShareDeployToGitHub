import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { AssetFile } from 'src/app/shared/domain';
@Injectable({
  providedIn: 'root',
})
export class MySpaceService extends RestService<AssetFile> {
  resource = 'digital-assets';
  // getFiles() {
  //   return this.http.get(this.appConfig.getResourceUrl(this.resource) + '/search');
  // }
}

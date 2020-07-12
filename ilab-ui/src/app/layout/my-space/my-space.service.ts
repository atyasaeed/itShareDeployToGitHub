import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { assetFile } from 'src/app/shared/domain';
@Injectable({
  providedIn: 'root',
})
export class mySpaceService extends RestService<assetFile> {
  resource = 'digital-assets';
}

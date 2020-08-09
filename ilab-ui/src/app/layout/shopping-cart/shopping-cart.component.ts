import { ToastrService } from 'ngx-toastr';
import { User } from '../../shared/domain/user.model';
import { Component, OnInit, Inject, ElementRef, TemplateRef } from '@angular/core';
import { ShoppingCartItem, Order, LineItem } from 'src/app/shared/domain';
import { ShoppingCartService } from '../../shared/services/shoppingcart.service';
import { Router } from '@angular/router';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { routerTransition } from 'src/app/router.animations';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { debounce, debounceTime, switchMap, delay } from 'rxjs/operators';
import * as THREE from 'three/build/three.module.js';
import { TdLoadingService } from '@covalent/core/loading';
import { GalleryService } from 'src/app/shared/services/gallery.service';
import { animate } from '@angular/animations';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
  animations: [routerTransition()],
})
export class ShoppingCartComponent extends DefaultListComponent<ShoppingCartItem, ShoppingCartService>
  implements OnInit {
  breadcrumbs = [{ heading: 'Cart', icon: 'fa-tasks' }];
  lang: string;
  loading = false;
  subTotal = 0;
  items: LineItem[];
  newCart: Order;
  authUser$: Observable<User>;
  hasAdminRole = false;
  dropdownSettings: IDropdownSettings = {};
  // quantitiesCount;
  selectedItemsArray;
  //test = true;
  modalRef: BsModalRef;
  stlColorBtns = [
    'aqua',
    'orange',
    'blue',
    'black',
    'silver',
    'brown',
    'red',
    'purple',
    'pink',
    'olive',
    'gold',
    'green',
  ];
  //test: string[] = ['assets/images/teapot.stl'];
  // items: Array<ShoppingCartItem>;
  constructor(
    service: ShoppingCartService,
    private appStore: Store<fromStore.AppState>,
    private toastr: ToastrService,
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    loadingService: TdLoadingService,
    private galleryService: GalleryService,
    private modalService: BsModalService
  ) {
    super(service, loadingService);
    this.authUser$ = this.appStore.select(fromStore.getAuthUser);
    //console.log(this.appConfig);
    this.appStore.select(fromStore.getLang).subscribe((lang) => {
      this.lang = lang;
    });

    this.dropdownSettings = {
      singleSelection: false,
      //idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.appStore.select(fromStore.getShoppingCart).subscribe((res) => {
      // console.log(res);
      //console.log(res?.lineItems);
      this.items = res?.lineItems;
      this.subTotal = res?.lineItems.map((item) => item.unitPrice * item.quantity).reduce((a, b) => a + b, 0);
      // this.quantitiesCount = res.lineItems.map((item) => item.quantity).reduce((a, b) => a + b, 0);
      // console.log(this.quantitiesCount);
      this.selectedItemsArray = Array(this.items.length);
      //console.log(this.items$);
      this.items.forEach((e, index) => {
        if (e.service.processes != undefined && e.service.processes.multi) {
          this.selectedItemsArray[index] = e.files[0].processes;
        }
      });
    });
  }

  ngOnInit() {
    this.authUser$.subscribe((user) => {
      this.hasAdminRole = user && user.roles.includes('ROLE_ADMIN');
    });
  }

  ngAfterViewInit() {}

  delete(entity) {
    this.purge(entity).subscribe((result) => {
      this.appStore.dispatch(new fromStore.LoadInitState());
    });
  }

  checkout() {
    this.service.checkout().subscribe((resp) => {
      this.service.searchTerm = '';
      // this.refresh();
      this.appStore.dispatch(new fromStore.LoadInitState());
    });
  }
  convertToGallery() {
    this.galleryService.convertToGallery().subscribe((res) => {
      this.toastr.success('Successful Addition To Gallery');
      this.appStore.dispatch(new fromStore.LoadInitState());
    });
  }

  updateItem(item: ShoppingCartItem, quantity) {
    let newItem = Object.assign({}, item);
    newItem.quantity = quantity;
    // console.log(newItem);
    // console.log(this.items$);
    if (quantity < 1 || quantity == '') {
      return;
    }
    this.loading = true;
    this.service.update(newItem).subscribe(
      (res) => {
        this.loading = false;
        // this.service.searchTerm = '';
        this.appStore.dispatch(new fromStore.LoadInitState());
      },
      (err) => {
        this.loading = false;
      }
    );

    // this.appStore.dispatch(new fromStore.UpdateLineItemQuantity(newItem));
  }

  textAreaChange(item: ShoppingCartItem, notes) {
    let newItem = Object.assign({}, item);
    newItem.notes = notes;

    this.service.update(newItem).subscribe((res) => {
      this.appStore.dispatch(new fromStore.LoadInitState());
    });
  }
  // removeCart() {
  //   this.service.removeCart().subscribe();
  // }

  // checkItems() {
  //   if (this.items.length === 0) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  getFileUrl(entity: ShoppingCartItem): string {
    //return this.appConfig.FILE_URL + entity.files[fileIndex].asset_id;
    return this.appConfig.FILE_URL + entity.files[0].asset_id;
  }

  getFileExtension(entity: ShoppingCartItem) {
    //return this.appConfig.FILE_URL + entity.files[fileIndex].asset_id;
    let extension = entity.files[0].asset_name.split('.');
    if (
      extension[extension.length - 1].toLowerCase() == 'png' ||
      extension[extension.length - 1].toLowerCase() == 'jpg'
    ) {
      return 'image';
    } else if (extension[extension.length - 1].toLowerCase() == 'stl') {
      return 'stl';
    } else {
      return null;
    }
  }
  // public getSubTotal(): Observable<number> {
  //   // return this.items.map((rr) => rr.unitPrice * rr.quantity).reduce((a, b) => a + b, 0);
  //   let subTotal;
  //   this.entities$.subscribe((res) => {
  //     subTotal = res.map((rr) => rr.unitPrice * rr.quantity).reduce((a, b) => a + b, 0);
  //   });
  //   return subTotal;
  // }
  selectChange(item: LineItem, event, type: string) {
    let newItem = JSON.parse(JSON.stringify(item));
    newItem.files[0][type] = event.target.value;
    this.service.update(newItem).subscribe((res) => {
      this.appStore.dispatch(new fromStore.LoadInitState());
    });
  }

  inputNumberChanged(item: LineItem, event, type: string, element: HTMLElement) {
    //console.log(event.target.value);
    if (event.target.value == '') {
      element.innerText = '*number is required';
    } else if (event.target.value < 1) {
      element.innerText = '*min value is 1';
    } else {
      element.innerText = '';
      let newItem = JSON.parse(JSON.stringify(item));
      newItem.files[0][type] = event.target.value;
      this.service
        .update(newItem)
        .pipe(
          debounceTime(500),
          switchMap(() => {
            return this.service.update(newItem);
          }),
          delay(500)
        )
        .subscribe((res) => {
          this.appStore.dispatch(new fromStore.LoadInitState());
        });
    }
  }

  onItemSelect(item: LineItem, i, element: HTMLElement) {
    element.innerText = '';
    let newItem = JSON.parse(JSON.stringify(item));
    newItem.files[0]['processes'] = this.selectedItemsArray[i];
    console.log(newItem);
    this.service.update(newItem).subscribe((res) => {
      this.appStore.dispatch(new fromStore.LoadInitState());
    });
  }
  onItemDeSelect(item: LineItem, i, element: HTMLElement) {
    if (this.selectedItemsArray[i].length == 0) {
      element.innerText = '*processes is required';
    } else {
      element.innerText = '';
      let newItem = JSON.parse(JSON.stringify(item));
      newItem.files[0]['processes'] = this.selectedItemsArray[i];
      console.log(newItem);
      this.service.update(newItem).subscribe((res) => {
        this.appStore.dispatch(new fromStore.LoadInitState());
      });
    }
  }
  onSelectAll(item: LineItem, event, element: HTMLElement) {
    element.innerText = '';
    let newItem = JSON.parse(JSON.stringify(item));
    newItem.files[0]['processes'] = event;
    console.log(newItem);
    this.service.update(newItem).subscribe((res) => {
      this.appStore.dispatch(new fromStore.LoadInitState());
    });
  }
  onDeSelectAll(element: HTMLElement) {
    //console.log(this.selectedItemsArray[i]);
    element.innerText = '*processes is required';
  }

  STLViewer(model, elementID) {
    var elem = document.getElementById(elementID);
    var camera = new THREE.PerspectiveCamera(70, elem.clientWidth / elem.clientHeight, 1, 1000);
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(elem.clientWidth, elem.clientHeight);
    elem.appendChild(renderer.domElement);
    window.addEventListener(
      'resize',
      function () {
        renderer.setSize(elem.clientWidth, elem.clientHeight);
        camera.aspect = elem.clientWidth / elem.clientHeight;
        camera.updateProjectionMatrix();
      },
      false
    );
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.rotateSpeed = 0.05;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;
    document.getElementById('toggleRotate').addEventListener('click', function () {
      controls.autoRotate = !controls.autoRotate;
    });

    var scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 1.5));
    new STLLoader().load(model, (geometry) => {
      var material = new THREE.MeshPhongMaterial({
        color: 0x87d,
        specular: 100,
        shininess: 100,
      });
      var mesh = new THREE.Mesh(geometry, material);

      scene.add(mesh);
      mesh.setColor = function (color) {
        mesh.material.color.set(color);
      };
      //var colorbtn = ['red', 'green'];
      this.stlColorBtns.forEach((e) => {
        document.getElementById(e).addEventListener('click', function () {
          mesh.setColor(e);
        });
      });
      //mesh.material.smoothShading = true;

      document.getElementById('toggleWireFrame').addEventListener('change', function (e: any) {
        if (e.target.checked) {
          mesh.material.wireframe = true;
        } else {
          mesh.material.wireframe = false;
        }
      });

      var middle = new THREE.Vector3();
      geometry.computeBoundingBox();
      geometry.boundingBox.getCenter(middle);
      mesh.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z));
      var largestDimension = Math.max(
        geometry.boundingBox.max.x,
        geometry.boundingBox.max.y,
        geometry.boundingBox.max.z
      );
      camera.position.z = largestDimension * 3;
      var animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
    });
  }

  loadStl(path: string, template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    if (document.getElementById('model').childNodes[0]) {
      document.getElementById('model').removeChild(document.getElementById('model').childNodes[0]);
    }
    this.STLViewer(path, 'model');
  }
}

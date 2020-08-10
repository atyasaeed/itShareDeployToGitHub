import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three/build/three.module.js';
@Component({
  selector: 'app-stl-modal',
  templateUrl: './stl-modal.component.html',
  styleUrls: ['./stl-modal.component.scss'],
})
export class StlModalComponent implements OnInit {
  @Input() stlPath: string;
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
  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {}

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

  loadStl(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    if (document.getElementById('model').childNodes[0]) {
      document.getElementById('model').removeChild(document.getElementById('model').childNodes[0]);
    }
    this.STLViewer(this.stlPath, 'model');
  }
}

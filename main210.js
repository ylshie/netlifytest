import {loadGLTF} from "./libs/loader.js";
//import {CSS3DRenderer} from "./libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js";;
import {CSS3DRenderer} from "./libs/CSS3DRenderer.js";
//import {mockWithVideo} from './libs/camera-mock.js';

//

const THREE = window.MINDAR.IMAGE.THREE;

window.CSS3DRenderer = CSS3DRenderer;

var raccoon = null;
const loadModel = async() => {
    raccoon = await loadGLTF('./assets/models/musicband-raccoon/scene.gltf');
}

loadModel();

function startMindAR() {
  const mindarThree = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,
    imageTargetSrc: './assets/targets/logo2.mind',
    filterMinCF: 1,
    filterBeta: 10000,
    missTolerance: 0,
    warmupTolerance: 0,
  });
  const {renderer, scene, camera} = mindarThree;

  const anchor = mindarThree.addAnchor(0);
  const geometry = new THREE.PlaneGeometry(1, 0.55);
  const material = new THREE.MeshBasicMaterial( {color: 0x00ffff, transparent: true, opacity: 0.5} );
  const plane = new THREE.Mesh( geometry, material );
  anchor.group.add(plane);

  const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
  scene.add(light);

  if (raccoon) {
    raccoon.scene.scale.set(0.1, 0.1, 0.1);
    raccoon.scene.position.set(0, -0.4, 0);
    anchor.group.add(raccoon.scene);
  }

  const start = async() => {
    // Sample
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      try {
        renderer.render(scene, camera);
      } catch(e) {
        console.log("render crash");
      }  
    });
  }
  start();
}

function startTimer() {
  setTimeout(function () {
      if (raccoon) {
          startMindAR()
      } else {
          setTimeout(startTimer, 100)
      }
  }, 100)
}
document.addEventListener('DOMContentLoaded', () => {
    startTimer();
});

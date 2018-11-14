window.addEventListener('load', init);
let r=-90
let deltax;
let preposX;
let deltay;
let preposY;
let s=90
let fov;
let rotationY=0;
let down=false;
function init() {
  // キャンパスサイズ
  const width = 960;
  const height = 540;
  const mouse = new THREE.Vector2();// マウス座標管理用のベクトルを作成
  const canvas = document.querySelector('#myCanvas');// canvas 要素の参照を取得する
  const renderer = new THREE.WebGLRenderer({// レンダラーを作成
    canvas: canvas
  });
  deltax=mouse.x
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);//サイズ
  renderer.setClearColor( 0x473CED,10 );//背景
  const scene = new THREE.Scene();// シーンを作成
  const camera = new THREE.PerspectiveCamera(45, width / height);// カメラを作成
  camera.position.set(0, -500, 1000);//初期ポジション
  fov=0;
  const meshList = [];// マウスとの交差を調べたいものは配列に格納する

  //軸
  const material_line = new THREE.MeshStandardMaterial({color: 0xffffff});//軸の色
  //X軸
  const geometryX_line = new THREE.BoxBufferGeometry(1000, 10, 10);
  const meshX_line = new THREE.Mesh(geometryX_line, material_line);
  //Y軸
  const geometryY_line = new THREE.BoxBufferGeometry(20, 1000, 20);
  const meshY_line = new THREE.Mesh(geometryY_line, material_line);
  //Z軸
  const geometryZ_line = new THREE.BoxBufferGeometry(30, 30, 1000);
  const meshZ_line = new THREE.Mesh(geometryZ_line, material_line);
  scene.add(meshX_line,meshY_line,meshZ_line);// シーンに保存
  for (let i = 0; i < 100; i++) {//データの数だけ
    //データ
    const geometry = new THREE.BoxBufferGeometry(25, 25, 25);
    const material = new THREE.MeshStandardMaterial({color: 0x201A71});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = parseInt( (Math.random()-0.5)*32)*25;//今はランダム
    mesh.position.y = parseInt( (Math.random()-0.5)*32)*25;
    mesh.position.z = parseInt(Math.random()*500);
    scene.add(mesh);//シーンに保存
    meshList.push(mesh);// 配列に保存
  }

  // 平行光源
  const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  // 環境光源
  const ambientLight = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);
  // レイキャストを作成
  const raycaster = new THREE.Raycaster();
  canvas.addEventListener('mousemove', handleMouseMove);
  tick();
  // マウスを動かしたときのイベント
  function handleMouseMove(event) {
  const element = event.currentTarget;
  // canvas要素上のXY座標
  const x = event.clientX - element.offsetLeft;
  const y = event.clientY - element.offsetTop;
  // canvas要素の幅・高さ
  const w = element.offsetWidth;
  const h = element.offsetHeight;
  // -1〜+1の範囲で現在のマウス座標を登録する
  mouse.x = ( x / w ) * 2 - 1;
  mouse.y = -( y / h ) * 2 + 1;
  }

  function handleKeydown(){//キーが押されたら
    var keyCode = event.keyCode;
    if (keyCode == 39) {// 右
    }
    else if (keyCode == 37) {// 左
    }
    else if (keyCode == 38) {// 上
    }
    else if (keyCode == 40) {// 下
    }
  }

  function mousedown(){//マウスが押されたら
    down=true;
    preposX=event.clientX;
    preposY=event.clientY;
  }

  function onMouseMove( event ) {//マウスが動いたら
    if(down){//マウスが押されている状態であれば
      deltax=event.clientX-preposX;//マウスが押された位置からの変異
      deltay=event.clientY-preposY;
      scene.rotation.z+=deltax*0.0001;
      scene.rotation.x+=deltay*0.0001;
      console.log(scene.rotation.x);
      //y軸方向の回転の制限
      if(scene.rotation.x>=0.45){
        scene.rotation.x=0.45;
      }else if(scene.rotation.x<=-1.1){
        scene.rotation.x=-1.1;
      }
    }
  }
  function mouseup(){//マウスが上がったら
    down=false;//マウスは押されていない状態
  }
  function onDocumentMouseWheel( event ) {//ホイール
    // WebKit
    if ( event.wheelDeltaY ) {
      fov -= event.wheelDeltaY * 0.05;
      // Opera / Explorer 9
    } else if ( event.wheelDelta ) {
      fov -= event.wheelDelta * 0.05;
      // Firefox
    } else if ( event.detail ) {
      fov += event.detail * 1.0;
    }
    //ズームの制限
    if(fov<=65){
      fov=65;
    }else if(fov>=1000){
      fov=1000;
    }
    // console.log(fov);
    camera.zoom=fov*0.01;
    camera.updateProjectionMatrix();
  }
  //ループ
  function tick() {
    // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
    raycaster.setFromCamera(mouse, camera);
    // その光線とぶつかったオブジェクトを得る
    const intersects = raycaster.intersectObjects(meshList);
    meshList.map(mesh => {
    // 交差しているオブジェクトが1つ以上存在し、
    // 交差しているオブジェクトの1番目(最前面)のものだったら
      if (intersects.length > 0 && mesh === intersects[0].object) {
      mesh.material.color.setHex(0xFF0000);// 色を赤くする
      } else {
      mesh.material.color.setHex(0x201A71);// それ以外は元の色にする
      }
    });
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("mousedown", mousedown);
    window.addEventListener("mouseup", mouseup);
    window.addEventListener( 'mousemove', onMouseMove, false );
    window.addEventListener( 'mousewheel', onDocumentMouseWheel);

    // レンダリング
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
}


// 选择文件并处理图片

// 根据 ID 获取对应的图像链接
function getFileURLById(id) {
  // 根据 id 返回对应的图像链接
  switch (id) {
    case 'BA':
      return 'BA.png';
    case 'BB':
      return 'BB.png';
    case 'BC':
      return 'BC.png';
    case 'BD':
      return 'BD.png';
    default:
      return null;

  }
}

// 清空 ASCII 字符画
function clearASCII() {
  const asciiElement = document.getElementById('ascii-art');
  asciiElement.textContent = '';
  console.log(asciiElement);
}

// 缩放图像
function scaleImage(img, targetWidth) {
  const scaleFactor = targetWidth / img.width;
  const targetHeight = Math.round(img.height * scaleFactor);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext('2d');
  context.drawImage(img, 0, 0, targetWidth, targetHeight);

  const scaledImg = new Image();
  scaledImg.src = canvas.toDataURL('image/jpeg');
  console.log(scaledImg);

  return scaledImg;
}

// 图片转换为 ASCII 字符画
function convertToASCII(img) {
  const asciiChars = [
    ' ',
    '.',
    ':',
    '+',
    '*',
    '?',
    '%',
    '#',
    '@',
    'A',
  ];

  const asciiChar = '█'; // 使用全角字符作为像素块
  const blockSize = 9; // 像素块大小为 16x16

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const context = canvas.getContext('2d');
  context.drawImage(img, 0, 0);

  let asciiArt = ''; // 存储最新的字符画
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
  for (let y = 0; y < canvas.height; y += blockSize) {
    for (let x = 0; x < canvas.width; x += blockSize) {
      let totalBrightness = 0;
      let pixelCount = 0;
      for (let blockY = y; blockY < y + blockSize; blockY++) {
        for (let blockX = x; blockX < x + blockSize; blockX++) {
          const index = (blockY * canvas.width + blockX) * 4;
          const r = imageData[index];
          const g = imageData[index + 1];
          const b = imageData[index + 2];
          const brightness = (r + g + b) / 3;
          totalBrightness += brightness;
          pixelCount++;
        }
      }
      const averageBrightness = totalBrightness / pixelCount;
      const charIndex = Math.floor((averageBrightness / 255) * (asciiChars.length - 1));
      const char = typeof asciiChars[charIndex] !== 'undefined' ? asciiChars[charIndex] : ' ';
      asciiArt += char;
      if (x + blockSize < canvas.width) {
        asciiArt += ''; // 添加像素块之间的空格
      }
    }
    if (y + blockSize < canvas.height) {
      asciiArt += '\n'; // 添加行之间的换行符
    }
  }

  return asciiArt;
  // console.log(asciiArt);
}

// 当前字符画显示的索引
let currentCharIndex = 0;
// 当前定时器的 ID
let timerId = null;

// 显示 ASCII 字符画
function displayASCII(asciiArt) {
  const asciiElement = document.getElementById('ascii-art');
  asciiElement.textContent = asciiArt.slice(currentCharIndex); // 只显示最新的字符画

  // 截取当前索引之前的字符
  const displayText = asciiArt.slice(0, currentCharIndex);
  // 设置显示文本内容
  asciiElement.textContent = displayText;

  // 增加当前索引
  currentCharIndex++;

  // 检查是否还有字符未显示完
  if (currentCharIndex <= asciiArt.length) {
    timerId = setTimeout(function () {
      displayASCII(asciiArt); // 继续显示下一个字符
    }, 0.1); // 设置延迟时间，控制字符显示速度
  }
}

// 处理点击事件
function handleClick(id) {
  if (timerId) {
    // 清除之前的定时器
    clearTimeout(timerId);
    timerId = null;
  }

  const fileURL = getFileURLById(id); // 根据 ID 获取对应的图像链接
  console.log(fileURL);
  if (fileURL) {
    // 清空字符画并暂停生成过程
    currentCharIndex = 0;
    clearASCII();

    const img = new Image();
    img.onload = function () {
      const scaledImg = scaleImage(img, 1024);
      scaledImg.onload = function () {
        const asciiArt = convertToASCII(scaledImg);
        displayASCII(asciiArt);
      };
    };
    img.src = fileURL;
  }
}


// 添加点击事件监听
const clickableElements = document.getElementsByClassName('clickable');
for (let i = 0; i < clickableElements.length; i++) {
  clickableElements[i].addEventListener('click', function (event) {
    const id = event.target.textContent;
    handleClick(id);
  });
}

var stringRandom = (function() {

  var data = {
      isScrolling : false,
      repeat : 0,
      target : [],
      letters : '*+-/@_$[%£!XO1&>',
      originalStrings : '',
      singleLetters : []
  }

  Array.prototype.shuffle = function() {
      var input = this;
       
      for (var i = input.length-1; i >=0; i--) {
       
          var randomIndex = Math.floor(Math.random()*(i+1)); 
          var itemAtIndex = input[randomIndex]; 
           
          input[randomIndex] = input[i]; 
          input[i] = itemAtIndex;
      }
      return input;
  }

  function checkLength(x) {
      return Array.from(document.querySelectorAll(x)).length > 0;
  }

  function addListener(evt, fx) {
      window.addEventListener(evt, fx);    
  }

  function changeLetter(letter) {
      if(letter.textContent != ' ') {
          letter.classList.add('is-changing');
          letter.style.animationDuration = Math.random().toFixed(2) + 's';
          
          var newChar = data.letters.substr( Math.random() * data.letters.length, 1);

          letter.textContent = newChar;
          letter.setAttribute('data-txt', newChar);
      }
  }

  function resetLetter(letter, value) {
          letter.classList.remove('is-changing');
          letter.textContent = value;
          letter.setAttribute('data-txt', value);
  }


  // divide le singole lettere delle stringhe e le wrappa in span
  function divideLetters() {

      data.target.forEach( (element, index) => {
          
          var text = element.textContent;
          var textDivided = '';

          data.originalStrings = text;

          for(var i = 0; i < text.length; i++) {
              textDivided += `<span class="el-sp el-st-${index}-span-${i}" data-txt="${text.substr(i, 1)}">${text.substr(i, 1)}</span>`;
          }

          element.innerHTML = textDivided;
      }); 
      data.singleLetters = document.querySelectorAll('.el-sp');
  }

  // changes letters
  function changeLetters() {
      if(data.isScrolling) {
          data.singleLetters.forEach(function(el, index){
              changeLetter(el);
          });
      }

      setTimeout(changeLetters, 10);
  }

  // reset to initial letters
  function resetLetters() {

      var randomArray = [];  
      for(var i = 0; i < data.singleLetters.length;i++) {
          randomArray.push(i);
      }

      randomArray.shuffle();

      randomArray.forEach(function(el, index){

          setTimeout(function(){
              resetLetter(data.singleLetters[el], data.originalStrings.substring(el, el + 1));
          }, (index * 20 * (Math.random() * 5))).toFixed(2);
              
      });
  }

  // event listener sullo scroll
  function updateScrollState() {
      clearTimeout(delay);
      data.isScrolling = true;
      
      var delay = setTimeout(function() {
          data.isScrolling = false;
          resetLetters();
      }, 300);
  };

  return {
      init: function(selector){

          // controllo che ci siano stringhe su cui agire
          if(checkLength(selector)) {

              // salvo le stringhe
              data.target = Array.from(document.querySelectorAll(selector));
              
              // divido le singole stringhe in lettere
              divideLetters();

              // lancio la funzione che si ripete
              changeLetters();

              // aggiungo il listener allo scroll
              addListener('scroll', updateScrollState);

          }
      }
  }

})();

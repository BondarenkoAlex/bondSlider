# bondSlider
bondSlider slider

http://alexbond.ru/blog/javascript-and-jquery/bondslider-jquery/ 

Демо: http://alexbond.ru/blog/javascript-and-jquery/bondslider-jquery/vertical-slider.html 

jsbin: http://jsbin.com/asabow/9/edit?html,css,output

НАСТРОЙКИ (ОПЦИИ)
Свойства
autoPlay 	Автоматическое листание слайдера
Возможные значения: true, false
По-умолчанию: true
autoPlayTime	Интервал времени между листанием слайдера в милисекундах
По-умолчанию: 7000
autoPlaySuspend	Приостанавливает автоматическое листание слайдера при нахождении курсора мышки на слайдере  
Возможные значения: true, false
По-умолчанию: true
loop	Зацикливание слайдера
Возможные значения: true, false
По-умолчанию: true
distance 	Листание на определенную дистанцию в px
По-умолчанию: null
activeFrame	Активный кадр в начальный момент времени
По-умолчанию: 0
sizeFrame	Количество пролистываемых кадров за один раз
По-умолчанию: 1
naviOverActive	Листание слайдера при наведении указателя мыши на кнопки навигации. (Навел мышку на кнопки navi – изменился активный кадр, без клика)
Возможные значения: true, false
По-умолчанию: false
hideButton:	Скрытие кнопок вперед/назад и контейнер навигации
Возможные значения: true, false
По-умолчанию:  false
hideButtonOpacity	Значение прозрачности для кнопок вперед/назад и контейнера навигации при активном режиме hideButton=true.
По-умолчанию: 0
hideButtonSpeed	Скорость скрытия/показа кнопок вперед/назад и контейнер навигации
Возможные значения: "fast","normal","slow", число (например: 5000)
По-умолчанию: " fast"
speedOpacity	Скорость исчезновения/появления кадров
Возможные значения: "fast","normal","slow", число (например: 5000)
По-умолчанию: "slow"
speedRotate	Скорость прокрутки кадров
Возможные значения: "fast","normal","slow", число (например: 5000)
По-умолчанию: "slow"
typeButton	Тип смены кадров, при нажатии на кнопки вперед/назад (next/ prev)
Возможные значения: "opacity","rotator"
По-умолчанию: "rotator"
typeThumb	Тип смены кадров, при нажатии на кнопку навигации (navi)
Возможные значения: "opacity","rotator"
По-умолчанию: "rotator"
typeAutoPlay	Тип смены кадров, при автоматическом листании
Возможные значения: "opacity","rotator"
По-умолчанию: "rotator"
typeScroller	Тип слайдера
Возможные значения: "horizontal","vertical"
По-умолчанию: "horizontal"
autoPlayDirect	Направление движения кадров при автоматическом листании
По-умолчанию: "next"
effButton	Эффект смены кадров, при нажатии на кнопки вперед/назад (next/ prev)
Возможные значения: можно посмотреть здесь  (http://jqueryui.com/demos/effect/easing.html)
По-умолчанию: "linear"
Примечание: при подключении библиотеки  jQuery UI  (http://jqueryui.com/demos/effect/#easing) или  jquery.easing (http://gsgd.co.uk/sandbox/jquery/easing/)
effThumb	Эффект смены кадров, при нажатии на кнопку навигации (navi)
Возможные значения: можно посмотреть здесь  (http://jqueryui.com/demos/effect/easing.html)
По-умолчанию: "linear"
Примечание: при подключении библиотеки  jQuery UI  (http://jqueryui.com/demos/effect/#easing) или  jquery.easing (http://gsgd.co.uk/sandbox/jquery/easing/)
effAutoPlay	Эффект смены кадров, при автоматическом листании
Возможные значения: можно посмотреть здесь  (http://jqueryui.com/demos/effect/easing.html)
По-умолчанию: "linear"
Примечание: при подключении библиотеки  jQuery UI  (http://jqueryui.com/demos/effect/#easing) или  jquery.easing (http://gsgd.co.uk/sandbox/jquery/easing/)
wrapFrames	Имя класса  "окна" слайдера
По-умолчанию: "bondWrapFrames"
frames	Имя класса контейнера кадров
По-умолчанию: "bondFrames"
frame	Имя класса кадра
По-умолчанию: "bondFrame"
navi	Имя класса контейнера кнопок навигации
По-умолчанию: "bondNavi"
thumb	Имя класса кнопки навигации
По-умолчанию: "bondThumb"
next	Имя класса кнопки вперед (следующий) кадр
По-умолчанию: "bondNext"
prev	Имя класса кнопки назад (предыдущий)
По-умолчанию: "bondPrev"
disableButton	Имя класса кнопки вперед/назад в неактивном состоянии
По-умолчанию: "disable"
activeThumb	Имя класса активной кнопки навигации
По-умолчанию: "activeThumb"


События 
callbackChangeActFrame	Функция обратного вызова, которая вызывается после нажатия на кнопки вперед/назад и кнопок навигации.
По-умолчанию: null
Примечание: Функция получает два значения. Первое значение – тип события (возможные значения: "next", "prev", "navi"), второе – активный кадр.
callbackClickFrame	Функция обратного вызова, которая вызывается после нажатия на кадр.
По-умолчанию: null
Примечание: Функция получает одно значения. Номер кадра по которому кликнул пользователь. Нумерация начинается с нуля.

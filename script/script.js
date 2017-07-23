$(document).ready(function(){
(function(){
	let flagClick = false; 							//флаг проверки запуска
	let flagHover = true;							//флаг проверки наведения
	let flagPlay = true;							//флаг проверки окончания выполнения

	$('.go').on('click', slider);					//назначаем обработчик по клику
	$('.go').hover(function(){						//обработчик по наведению hover
		flagHover = false;							//при наведении прекратить анимацию
	}, function(){									//unhover
		flagHover = true;							//возобновить анимацию
		showImage();								//запустить функцию анимции
	});

	function slider(){								//запуск слайдера по клику
		if (!flagClick) {							//если запуска не было
			flagClick = true;						//флаг запуска включить
			flagPlay = true;						//флаг окончания выполнения включить
			showImage();							//запустить функцию анимации
		} else{
			flagClick = false;						//иначе установить флаг на остановку анимации
		}
	}

	function showImage(){							//функция анимации показа
		if ((flagClick)&&(flagHover)&&(flagPlay)) {	//если все флаги включены тогда выполнять
			flagPlay = false;						//флаг окончания отключить
			var adressImg = 'img/slider/';			//адрес папки с изображениями
			$.ajax({								//jQuery AJAX-запрос
				url: 'images.php',					//скрипт, к которому обращаемся
				type: 'POST',						//тип запроса
				dataType: 'text',					//тип данных ответа
				data: 'fonder='+ adressImg,			//данные запроса
				success: function(data){			//в случае УСПЕШНОГО ответа (текст ответа)
					let answer = data.split('|');	//разбить текст ответа по разделителю |

					let arrayAnswer = function (answer){								//функция выбирает из ссылок имена картинок и возвращает их (массив с ссылками)
							let reg = /^(.+)(jpg|jpeg|png)$/i;							//рег.выражение сравнения
							let arrayAnswer = [];										//массив результатов
							for (let i = 0, n = 0; i < answer.length; i++){				//обходим массив ссылок
								if (reg.test(answer[i])){								//если "картинка"
									arrayAnswer[n] = answer[i].replace(reg, '$1$2');	//добавить в результирующий массив
									n++;												//перейти к след. индексу результ массива
								}
							}
							return arrayAnswer;											//вернуть результирующий массив
						}(answer);														//вызвать функцию с аргументом

					$('<img>').appendTo('.slider-img');									//добавить элемент <img> в слайдер

					let adress = function(arrayAnswer){									//функция поиска адреса добавляемого изображения (массив адресов изображений)
						let absImageSrc = document.querySelector('.slider-img img').src;//абсолютный адрес существующего изображения
						if (!absImageSrc){return arrayAnswer[0]};						//если изображений на странице еще нет вернуть адрес первого изображения в массиве
						let image = document.querySelector('.slider-img img');			//тег с изображением
						let base = image.baseURI;										//адрес хоста (сайта)
						let reg = new RegExp('(' + base + ')' + '(.+)$', 'i');			//регулярное выражение с адресом сайта
						let relImageSrc = absImageSrc.replace(reg, '$2');				//откидываем из адреса изображения адрес сайта (получаем относительный адрес)
						for (let i = 0; i < arrayAnswer.length; i++){					//обходим массив ссылок
							if (relImageSrc == arrayAnswer[i]){							//если относительный адрес совпал с адресом в массиве
								if (i == (arrayAnswer.length - 1)){						//если это последний файл в папке
									return arrayAnswer[0];								//вернуть адрес первого файла
								} else{
									return arrayAnswer[i + 1];							//иначе - вернуть адрес следующего
								}
							}
						}
					}(arrayAnswer);														//вызвать функцию

						//получаем последнее изображение.устанавливаем полученный адрес.делаем сдвиг влево на 100%.задержка 1с, чтобы изображение успело прогрузиться.анимация левого сдвига в 0, время анимации, скорость, функция-коллбэк
					$('.slider-img img:last').attr('src', adress).css('left', '100%').delay(1000).animate({left:'0'}, 3000, 'linear', function(){
						let imagesSlider = document.querySelectorAll('.slider-img img');	//получаем все изображения вслайдере
						if (imagesSlider.length > 1) {										//если их больше 1
							imagesSlider[0].parentNode.removeChild(imagesSlider[0]);		//удаляем первое
						}
						flagPlay = true;													//включаем флаг окончания
						setTimeout(showImage, 1000);										//после задержки 1с запускаем эту функцию повторно
					});
				}
			})
		}
	}
}());
(function(){
	$('.point').on('click', carusel);
	function carusel(){
		if ($(this).hasClass('active')) return;
		$('.point').removeClass('active').filter(this).addClass('active');
		let pointNumber = $('.point').index(this);
		let startPack = pointNumber*4;
		let endPack = startPack + 4;
		$('.wrap-man').addClass('hide-man').slice(startPack, endPack).removeClass('hide-man');
	}
}());
});

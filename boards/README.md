
PCZEN Board
================

**개요..?**
    
    기본적인 게시판 및 위키처럼 편집할수있는 강좌를 만들 수 있는 서비스를 제공하는 사이트
    Tacademy Node.js 게시판 을 참고

***Data Stores***

	mongoDB

***Languages & Frameworks***

	jade : view
	node - express
	javascript

***Protocol Definition***

	writeform  : get /board/write
	write : post /board/write
	write_300  : post /board/write300
	
	list : get /board/list, /board/list/:page
	
	read : get /board/read/:page/:num

	modifyform : get /board/update
	modify : post /board/update/:page/:num

	delete form : get /board/delete
	delete : post /board/delete

	login : get&post /users/login
	signup :get&post /users/signup

	show the post : get /board/read/:page/:postnum
____



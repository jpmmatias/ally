let convidarBtn = document.querySelector("#convidar")
let aceitarBtn = document.queySelector('#aceitarBtn')
let recusarBtn = document.queySelector('#recusarBtn')

const pegarID = () => {
	let url = window.location.href;
	let urlSeparado = url.split('/');
	let ROOM_ID = urlSeparado[5];
	return ROOM_ID;
};

let mandarConvite = (nome)=> {
	console.log(nome)
    let id = pegarID()
    console.log(id)
	return fetch(`http://localhost:5000/testes/add/${id}/convidar/`,{
	 	method: 'POST', 
		headers: {
			'Accept': 'application/json',
		'Content-Type': 'application/json'
	 	  },
	 	body: JSON.stringify({nome: nome})
	 }).then((res)=>{
	 	console.log(res)
	}).catch(err=>{
	 	console.log(err)
	 })
   }

//    $(document).ready(function(){
// 	$(‘.friend-add’).on(‘click’, function(e){
// 	e.preventDefault();
// 	});
// 	$(‘#accept_friend’).on(‘click’, function(){
// 	var senderId= $(‘#senderId’).val();
// 	var senderName= $(‘#senderName’).val();
// 	$.ajax({
// 	url: ‘/search’,
// 	type: ‘POST’,
// 	data: {
// 	senderId:senderId,
// 	senderName: senderName
// 	},
// 	success: function() {
// 	$(this).parent().eq(1).remove();
// 	}
// 	});
// 	$(‘#reload’).load(location.href + ‘ #reload’);
// 	});
// 	$(‘#cancel_friend’).on(‘click’, function(){
// 	var user_Id= $(‘#user_Id’).val();
// 	// console.log(user_Id);
// 	$.ajax({
// 	url: ‘/search’,
// 	type: ‘POST’,
// 	data: {
// 	user_Id: user_Id
// 	},
// 	success: function() {
// 	$(this).parent().eq(1).remove();
// 	}
// 	});
// 	$(‘#reload’).load(location.href + ‘ #reload’);
// 	});
// 	});


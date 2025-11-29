var cs = 0;
function $(val){
	return document.querySelector(val);
}
$(".banner").children[0].style.backgroundColor = "#cccccc";
function nav(val){
	if(val == cs) return;
	$(".banner").children[cs].style.backgroundColor = "transparent";
	switch(cs){
	case 0:
		$(".h-card").style.bottom = "-60vh";
		$(".add-n").style.bottom = "-60vh";
		break;
	case 1:
		$(".d-card").style.bottom = "-75vh";
		break;
	}
	$(".banner").children[val].style.backgroundColor = "#cccccc";
	switch(val){
	case 0:
		$(".add-n").style.bottom = "calc(60vh - 30px)";
		$(".h-card").style.bottom = "9.5vh";
		break;
	case 1:
		$(".d-card").style.bottom = "9.5vh";
		break;
	}
	cs = val;
}
function openDetector(){
	$(".work").style = "left:0; opacity:1";
}
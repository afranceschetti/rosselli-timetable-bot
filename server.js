var unirest = require('unirest');

var DEBUG = true;
var DEFAULT_TIMEOUT = 60;
var BASE_URL = "https://api.telegram.org/bot";

// http://apps.timwhitlock.info/emoji/tables/unicode
// http://www.fileformat.info/info/unicode/char/1f1eB/index.htm
var config = [{	
					classroom: "1 A",
					bot_token: "<token  bot 1>",
					timetable:
						{	"Luned\u00EC":["\uD83D\uDCD0  Tecnologia  \uD83D\uDCBC", "\uD83D\uDCD0  Tecnologia  \uD83D\uDCBC", "\uD83C\uDF0D  Geografia", "\uD83D\uDCC3  Storia", "\uD83D\uDCC4  Grammatica", "\uD83D\uDCC8  Matematica"],
							"Marted\u00EC":["\uD83C\uDDEC\uD83C\uDDE7   Inglese", "\uD83D\uDCC3   Storia", "\uD83D\uDCC8  Matematica", "\uD83C\uDFB6 Musica  \uD83C\uDFBA", "\uD83D\uDCD6  Epica", "\uD83C\uDDEB\uD83C\uDDF7  Francese"],
							"Mercoled\u00EC":["\uD83C\uDF93  Approfondimento", "\uD83C\uDDEB\uD83C\uDDF7  Francese", "\uD83C\uDFA8  Arte", "\uD83C\uDFA8 Arte", "\uD83D\uDD2C  Scienze", "\uD83C\uDF0D  Geografia"],
							"Gioved\u00EC":["\uD83D\uDCC8  Matematica", "\uD83C\uDDEC\uD83C\uDDE7  Inglese", "\uD83C\uDFB6  Musica  \uD83C\uDFBA", "\uD83D\uDCDA  Antologia", "\uD83D\uDCDA  Antologia", "\uD83C\uDFC3  Educazione fisica  \uD83D\uDC5F"],
							"Venerd\u00EC":["\uD83C\uDFC3  Educazione fisica  \uD83D\uDC5F", "\uD83C\uDDEC\uD83C\uDDE7  Inglese", "\uD83D\uDCF0  Alternativa", "\uD83D\uDCC8  Matematica", "\uD83D\uDD2C  Scienze", "\uD83D\uDCC4  Grammatica"],
						},
					offset: 0
				},
				{
					classroom: "1 B",
					bot_token: "<token  bot 2>",
					timetable: 
						{	"Luned\u00EC":["\uD83C\uDDEB\uD83C\uDDF7  Francese", "\uD83D\uDD2C  Scienze", "\uD83C\uDFC3  Educazione fisica  \uD83D\uDC5F", "\uD83D\uDCC4  Grammatica", "\uD83C\uDFB6  Musica  \uD83C\uDFBA", "\uD83C\uDF0D  Geografia"],
							"Marted\u00EC":["\uD83C\uDFA8  Arte", "\uD83D\uDCC8  Matematica", "\uD83D\uDCC8  Matematica", "\uD83C\uDDEC\uD83C\uDDE7   Inglese", "\uD83D\uDCD0  Tecnologia  \uD83D\uDCBC", "\uD83D\uDCD0  Tecnologia  \uD83D\uDCBC"],
							"Mercoled\u00EC":["\uD83D\uDCC4  Grammatica", "\uD83D\uDCC3  Storia", "\uD83C\uDDEC\uD83C\uDDE7   Inglese", "\uD83C\uDDEB\uD83C\uDDF7  Francese", "\uD83D\uDCDA  Antologia", "\uD83D\uDCC4  Grammatica"],
							"Gioved\u00EC":["\uD83D\uDCF0  Alternativa", "\uD83C\uDFB6  Musica  \uD83C\uDFBA", "\uD83C\uDFC3  Educazione fisica  \uD83D\uDC5F", "\uD83D\uDD2C  Scienze", "\uD83C\uDF0D  Geografia", "\uD83C\uDF93  Approfondimento"],
							"Venerd\u00EC":["\uD83D\uDCDA  Antologia", "\uD83D\uDCC4  Grammatica", "\uD83D\uDCC3  Storia", "\uD83C\uDDEC\uD83C\uDDE7  Inglese", "\u270F  Disegno", "\u2B1B  Geometria"],
						},
					offset: 0
				}];

var weekKeyboard = {'keyboard': [['Luned\u00EC'],['Marted\u00EC'],['Mercoled\u00EC'],['Gioved\u00EC'],['Venerd\u00EC']], 'one_time_keyboard': true,'resize_keyboard': true}
var hourConter = ['I   ','II  ','III ','IV ','V  ','VI ']

var startPolling= function() {
	for (var classroomIndex = 0; classroomIndex < config.length; classroomIndex++) {
		poll(classroomIndex);
	}
	if (DEBUG) console.log("Polling now.", config.length);
};

var poll = function(classroomIndex){
	var url = BASE_URL+ config[classroomIndex].bot_token + "/"+ "getUpdates?offset="+config[classroomIndex].offset+"&timeout=" + DEFAULT_TIMEOUT;
	unirest.get(url).end(function(response) {telegramCallback(classroomIndex, response)});
}

var telegramCallback = function(classroomIndex, response) {
	if (DEBUG) console.log("Starting new request", classroomIndex);

	var body = response.raw_body;
	if (response.status == 200) {

		var jsonData = JSON.parse(body);
		var result = jsonData.result;

		if (result.length > 0) {
			for (i in result) {
				responseTimetable(classroomIndex, result[i].message);
			}

			config[classroomIndex].offset = parseInt(result[result.length - 1].update_id) + 1; // update max offset
		}
	}

	poll(classroomIndex);
};

startPolling();


var responseTimetable = function(classroomIndex, message){
	var answer = {
			chat_id : message.chat.id,
            reply_markup : JSON.stringify(weekKeyboard)
    };

    var timetable = config[classroomIndex]['timetable'][message.text];
	if(timetable!=null){
		var timetableString = "Ecco l'orario di " + message.text + "\n";
		for (var i = 0; i < timetable.length; i++) {
			timetableString += hourConter[i] +" - " + timetable[i] + "\n";
		}		
		answer.text = timetableString
	}
	else{
		answer.text = "Non ho capito... di che giorno vorresti sapere l'orario?";
	}
	var sendMessageUrl =  BASE_URL+ config[classroomIndex].bot_token + "/" + "sendMessage";
	unirest.post(sendMessageUrl).send(answer).end(function (response) { });
}

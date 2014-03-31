function Emoticon(name, triggers, image, height) {
	this.name = name;
	this.triggers = triggers;
	this.image = image;
	this.height = height;
}

function EmoticonRegistry() {
	this.emoticonMap = {};
	this.add = function(emoticon) {
		for (var i = 0; i < emoticon.triggers.length; ++i) {
			var trigger = emoticon.triggers[i];
			this.emoticonMap[trigger] = emoticon;
		}
	}
}

var emoticonRegistry = new EmoticonRegistry();
emoticonRegistry.add(new Emoticon('*flausch*', ['*flausch*',':glitter',':fluff'], 'red_unicorn_glitter.gif', 34));
emoticonRegistry.add(new Emoticon(':runicorn', [':runicorn', ':runicorn:'], 'red_unicorn.gif', 28));
emoticonRegistry.add(new Emoticon(':bunicorn', [':bunicorn', ':bunicorn:'], 'blue_unicorn.gif', 28));
emoticonRegistry.add(new Emoticon(':shun', [':shun',':shun:'], 'blue_unicorn_shun.gif', 44));
emoticonRegistry.add(new Emoticon(':wiesel', [':wiesel',':weasel',':wiesel:',':weasel:'], 'ferret.gif', 15));
emoticonRegistry.add(new Emoticon(':albino', [':albino'], 'albino.gif', 19));
emoticonRegistry.add(new Emoticon('y3', [':y3','y3'], 'heart.gif', 19));
emoticonRegistry.add(new Emoticon(':h2o2', [':h2o2',':h2o2:'], 'h2o23.png', 16));
emoticonRegistry.add(new Emoticon('x_X', ['x_X','X_x','x_x','X_X'], 'fluffy_emoticons_dead.gif', 17));
emoticonRegistry.add(new Emoticon('<<', ['<<','>>'], 'fluffy_emoticons_shifty.gif', 17));
emoticonRegistry.add(new Emoticon(':(', [':(',':((',':(((',':(((('], 'fluffy_emoticons_sad.gif', 17));
emoticonRegistry.add(new Emoticon(":'(", [":'("], 'fluffy_emoticons_cry.gif', 17));
emoticonRegistry.add(new Emoticon(':)', [':)',':))',':)))',':))))'], 'fluffy_emoticons_happy.gif', 17));
emoticonRegistry.add(new Emoticon(':>', [':>',':>>',':>>>',':>>>>'], 'fluffy_emoticons_cheeky.gif', 17));
emoticonRegistry.add(new Emoticon(':]', [':]',':]]',':]]]',':]]]]','qed'], 'fluffy_emoticons_proud.gif', 17));
emoticonRegistry.add(new Emoticon('>:)', ['>:)'], 'fluffy_emoticons_evil.gif', 17));
emoticonRegistry.add(new Emoticon('._.', ['._.',':/',':\\'], 'fluffy_emoticons_meh.gif', 17));
emoticonRegistry.add(new Emoticon('???', ['???'], 'fluffy_emoticons_confused.gif', 17));
emoticonRegistry.add(new Emoticon(';)', [';)',';))',';)))',';))))'], 'fluffy_emoticons_wink.gif', 17));
emoticonRegistry.add(new Emoticon('^^', ['^^','^_^'], 'fluffy_emoticons_circonflex.gif', 17));
emoticonRegistry.add(new Emoticon('-_-', ['-_-'], 'fluffy_emoticons_disappointed.gif', 17));
emoticonRegistry.add(new Emoticon('`_´', ['`_´','grrr'], 'fluffy_emoticons_angry.gif', 17));
emoticonRegistry.add(new Emoticon(':D', [':D',':DD',':DDD',':DDDD'], 'fluffy_emoticons_grin.gif', 17));
emoticonRegistry.add(new Emoticon('D:', ['D:','DD:','DDD:','DDDD:'], 'fluffy_emoticons_shocked.gif', 17));
emoticonRegistry.add(new Emoticon(':O', [':o',':O'], 'fluffy_emoticons_surprise.gif', 17));
emoticonRegistry.add(new Emoticon('O_o', ['O_o','o_O','O_O','o_o'], 'fluffy_emoticons_weird.gif', 17));
emoticonRegistry.add(new Emoticon(':omg:', ['omg',':omg',':omg:'], 'fluffy_emoticons_omg.gif', 17));
emoticonRegistry.add(new Emoticon(':P', [':P', ':p'], 'fluffy_emoticons_tongue.gif', 17));
emoticonRegistry.add(new Emoticon(':rolleyes:', [':rolleyes',':rolleyes:'], 'fluffy_emoticons_rolleyes.gif', 17));
emoticonRegistry.add(new Emoticon(':suizid:', [':suizid',':suicide',':suizid:',':suicide:'], 'fluffy_emoticons_suizid.gif', 17));
emoticonRegistry.add(new Emoticon(":')", [":')"], 'fluffy_emoticons_happytears.gif', 17));
emoticonRegistry.add(new Emoticon(":ugly:", [":ugly:"], 'ugly.gif'), 16);

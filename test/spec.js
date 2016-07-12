describe('Who wants to be a scientist?', function() {
	it('should have a title', function() {
		browser.get('http://localhost:8080');
		expect(browser.getTitle()).toEqual('Who wants to be a scientist?');
	});
	it('should play the game', function() {
		var names = [ 'bot1', 'bot2', 'bot3', 'bot4' ];
		element(by.css('input[type="text"]')).sendKeys(names[0]);
		element(by.css('input[type="submit"]')).click();
		expect(element(by.id('1')).getText()).toEqual(names[0]);

		//Log all the players in
		function login(i) {
			element(by.css('input[type="text"]')).sendKeys(names[i]);
			element(by.css('input[type="submit"]')).click();
			var id = (i + 1).toString(),
				player = element(by.id(id));
			browser.wait(player.isPresent());
			expect(player.getText()).toEqual(names[i]);
			if (i < 3) {
				login(i + 1);
			}
		}
		login(1);

		//Answer at random till the game ends
		function answer(i) {
			var c = element(by.css('.category'));
			browser.wait(c.isPresent());
			c.click();
			var a = element(by.css(''.answer));
			browser.wait(a.isPresent());
			a.click();
		}
		answer(0);
	});
});

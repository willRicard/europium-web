describe('Who wants to be a scientist?', () => {
    it('should have a title', () => {
        browser.url('http://localhost:8080');
        expect(browser.getTitle()).toEqual('Who wants to be a scientist?');
    });
    it('should play the game', () => {
        var names = [ 'willie', 'zillie', 'allie', 'billie' ];
        browser.setValue('input[type="text"]', names[0]);
        browser.click('input[type="submit"]');
        browser.waitForExist('#1');
        expect(browser.getText('#1')).toEqual(names[0]);

		//Login
		function login(name,i) {
            browser.newWindow('http://localhost:8080');
            browser.setValue('input[type="text"]', name);
            browser.click('input[type="submit"]');
            var id = '#' + (i + 1);
            browser.waitForExist(id);
            expect(browser.getText(id)).toEqual(names[i]);
			if (i < 3) {
				login(names[i+1],i+1);
			}
        }

		function answer(player, i) {
			//Pick a random category, then a random answer
			browser.waitForVisible('.category');
			browser.click('.category');
			browser.waitForVisible('.answer');
			browser.click('.answer');

			expect(browser.getLocation('#1')).not.toEqual({x: 0, y: 0});
            browser.debug();
		}

		login(names[1],1);
		answer(names[0],0);
    });
});

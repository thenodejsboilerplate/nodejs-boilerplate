/**
 * Created by frank25184 on 7/14/16.
 */
//ensure that we have a contact-us link on the about page
//need to be put in a html file
suite("'about' Page Tests", function(){
    test('Page should contain link to contact page', function(){
        assert(document.querySelector('a[href="/contact"]'));
    });
});
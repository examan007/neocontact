var ContactModule = angular.module('ContactManager', ['ui.router']);
var Contacts = null;
execute_ContactApp();
var ContactManager = {
    getController: function () {
        return (Contacts);
    },
}
function execute_ContactApp() {
    ContactModule.controller('ContactController', ['$scope', function ($scope) {
        Contacts = this;
        Contacts.scope = $scope;
        Contacts.update = function () {
            Contacts.scope.$apply();
        }
        Contacts.objects = [
        {
            Name: "Contact One",
            Key: "ContactOne",
            Phone: "555-555-5555",
            Address: "1 Yonge Street",
            Email: "contact.one@gmail.com",
            SmallImage: "images/IMG_20160729_095132.jpg",
            LargeImage: "images/IMG_20160729_095132.jpg",
            HomeDir: '/home/contactone',
            Location: "E502",
            UserTitle: "Administrator",
            UserLevel: "Red"
        },
        {
            Name: "Contact Two",
            Key: "ContactTwo",
            Phone: "555-555-5555",
            Address: "1 Yonge Street",
            Email: "contact.one@gmail.com",
            SmallImage: 'images/nouserpic-50.png',
            LargeImage: 'images/nouserpic-225.png',
            HomeDir: "/home/dev",
            Location: "E501",
            UserTitle: "Developer",
            UserLevel: "White"
        }];
        Contacts.hashmap = [];
        Contacts.objects.forEach( function (obj) {
            Contacts.hashmap[obj.Key] = obj;
        });
    }]);
}

$(document).ready(function() {
    var panels = $('.user-infos');
    var panelsButton = $('.dropdown-user');
    panels.hide();

    //Click dropdown
    panelsButton.click(function() {
        //get data-for attribute
        var dataFor = $(this).attr('data-for');
        var idFor = $(dataFor);
        console.log('panelsButton' + JSON.stringify(dataFor));
        //current button
        var currentButton = $(this);
        idFor.slideToggle(400, function() {
            //Completed slidetoggle
            if(idFor.is(':visible'))
            {
                currentButton.html('<i class="glyphicon glyphicon-chevron-up text-muted"></i>');
            }
            else
            {
                currentButton.html('<i class="glyphicon glyphicon-chevron-down text-muted"></i>');
            }
        })
    });


    $('[data-toggle="tooltip"]').tooltip();

    $('button').click(function(e) {
        e.preventDefault();
        alert("This is a demo.\n :-)");
    });

    window.setTimeout(initImages, 0);

});

function initImages() {
    console.log('initImages ... z');
    var i = 0;
    try {
        test(document.getElementById('ContactManager'));
        Contacts.update();
    } catch (e) {
        console.log(e.toString());
    }
    function test(element) {
        i++;
        // console.log('i=' + i + ' nodeName=' + element.nodeName);
        for ( var n = 0; n < element.childNodes.length; n++) {
            test(element.childNodes[n]);
        }
        function getsrc(obj, value) {
            var src = 'images/nouserpic-50.png';
            if (value == null) { } else
            if (typeof(obj.scope) === 'undefined') { } else {
                try {
                    src = obj.scope().obj[value];
                    console.log('value=[' + value + '] src=[' + src + ']');
                } catch (e) {
                    console.log('getsrc() ' + e.toString());
                }
            }
            return (src);
        }
        if (element.nodeName === 'IMG') {
            element.setAttribute('src', getsrc($(element), element.getAttribute('data-src')));
        }
    }
}

// window.onload = init;
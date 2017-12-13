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
        Contacts.contactname = '';
        Contacts.update = function () {
            Contacts.scope.$apply();
        }
        Contacts.edit = function (obj) {
            console.log('edit obj=' + JSON.stringify(obj));
            obj.showclass = 'noshow';
            obj.editclass = 'show';
        }
        Contacts.save = function (obj) {
            console.log('save obj=' + JSON.stringify(obj));
            obj.showclass = 'show';
            obj.editclass = 'noshow';
        }
        Contacts.remove = function (obj) {
            console.log('remove obj=' + JSON.stringify(obj));
        }
        Contacts.upload = function (obj) {
            console.log('upload obj=' + JSON.stringify(obj));
        }
        Contacts.create = function () {
            console.log('create obj=[' + JSON.stringify(Contacts.contactname) + ']');
            if (Contacts.contactname.length <= 0) { } else {
                var obj = {
                    Name: Contacts.contactname,
                    SmallImage: 'images/nouserpic-50.png',
                    LargeImage: 'images/nouserpic-225.png',
                    showclass: 'noshow',
                    editclass: 'show',
                    direction: 'up'
                };
                if (addToHashMap(obj) == true) {
                    Contacts.objects.unshift(obj);
                }
            }
        }
        Contacts.search = function () {
            console.log('search obj=[' + JSON.stringify(Contacts.contactname) + ']');
        }
        Contacts.showWithKey = function (dataFor) {
            var idFor = $(dataFor);
            console.log('panelsButton' + JSON.stringify(dataFor));
            //current button
            idFor.slideToggle(400, function() {
            })
        }
        Contacts.show = function (obj) {
            //Contacts.showWithKey(obj.attr('data-for'));
        }
        Contacts.expand = function (obj) {
            var panels = $('.user-infos');
            if (typeof(obj.direction) === 'undefined') {
                obj.direction = 'up';
            } else
            if (obj.direction === 'up') {
                obj.direction = 'down';
            } else {
                obj.direction = 'up';
            }
            Contacts.showWithKey('#' + obj.Key);
        }
        Contacts.template = [
        {
            name: 'Phone',
            label: 'Phone number'
        },
        {
            name: 'Address',
            label: 'Postal address'
        },
        {
            name: 'Email',
            label: 'Email address'
        },
        {
            name: 'HomeDir',
            label: 'Home directory'
        },
        {
            name: 'Location',
            label: 'Office location'
        },
        {
            name: 'UserTitle',
            label: 'Role title'
        },
        {
            name: 'UserLevel',
            label: 'Role level'
        }
        ];
        Contacts.objects = [
        {
            Name: "James Hayes",
            Phone: "416-575-7301",
            Address: "Rathburn Road West",
            Email: "james.hayes@neolation.com",
            SmallImage: "images/IMG_20160729_095132.jpg",
            LargeImage: "images/IMG_20160729_095132.jpg",
            HomeDir: '/home/contactone',
            Location: "E502",
            UserTitle: "Full stack developer",
            UserLevel: "Red"
        },
        {
            Name: "Contact Two",
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
        Contacts.objects.forEach( function (obj) {
            obj.editclass = 'noshow';
            obj.direction = 'down';
        });
        Contacts.hashmap = [];
        function addToHashMap(obj) {
            var ret = false;
            var isAlpha = function(ch){
                return /^[A-Z]$/i.test(ch);
            }
            obj.Key = obj.Name.replace(' ', '_');
            if (typeof(Contacts.hashmap[obj.Key]) === 'undefined') {
                Contacts.hashmap[obj.Key] = obj;
                ret = true;
            }
            return (ret);
        }

        Contacts.objects.forEach( function (obj) {
            addToHashMap(obj);
        });
    }]);
}

function showAttrs() {
    //get data-for attribute
    Contacts.show($(this));
}

$(document).ready(function() {
    var panels = $('.user-infos');
    var panelsButton = $('.dropdown-user');
    panels.hide();

    //Click dropdown
    panelsButton.click(showAttrs);

    $('[data-toggle="tooltip"]').tooltip();

    $('button').click(function(e) {
        e.preventDefault();
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
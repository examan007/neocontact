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
        Contacts.Debug = 0;
        Contacts.update = function () {
            Contacts.scope.$apply();
        }
        Contacts.getKey = function (obj) {
            var isAlpha = function(ch) {
                return /^[A-Z]$/i.test(ch);
            }
            return (obj.Name.replace(' ', '_'));
        }
        Contacts.exists = function (obj) {
            var ret = false;
            try {
                if (typeof(Contacts.hashmap[Contacts.getKey(obj)]) === 'undefined') {} else {
                    ret = true;
                }
            } catch (e) {}
            return(ret);
        }
        Contacts.edit = function (obj) {
            console.log('edit obj=' + JSON.stringify(obj));
            obj.showclass = 'noshow';
            obj.editclass = 'show';
        }
        Contacts.sendData = function (data, success, failure) {
            if (Contacts.Debug < 1) { } else
            try {
                console.log('data=' + JSON.stringify(data));
            } catch (e) {
                console.log(e);
            }
            $.ajax({
                url: '/private',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
                success: success,
                error: function (xhr, textStatus, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    console.log('xhr=' + JSON.stringify(err));
                    failure('Error[ ' + JSON.stringify(err) + ']');
                }
            });
        }
        Contacts.save = function (obj) {
            obj.operation = 'save';
            Contacts.sendData(obj, function (data) {
                console.log('sendData response=' + JSON.stringify(data));
                if (data.status === 'Error') {
                    alert(data.message);
                } else {
                    console.log('save obj=' + JSON.stringify(obj));
                    obj.showclass = 'show';
                    obj.editclass = 'noshow';
                }
                Contacts.update();
            }, function (msg) {
                alert(msg);
            });
        }
        Contacts.remove = function (obj) {
            console.log('remove obj=' + JSON.stringify(obj));
            obj.operation = 'remove';
            Contacts.sendData(obj, function (data) {
                console.log('sendData response=' + JSON.stringify(data));
                if (data.status === 'Error') {
                    alert(data.message);
                } else {
                    console.log('remove post obj=' + JSON.stringify(obj));
                    for (var i = 0; i < Contacts.objects.length; i++) {
                        if (Contacts.objects[i].Key === obj.Key) {
                            Contacts.removeFromHashMap(obj);
                            Contacts.objects.splice(i, 1);
                            break;
                        }
                    }
                    Contacts.update();
                }
            }, function (msg) {
                alert(msg);
            });
        }
        Contacts.upload = function (obj) {
            console.log('upload obj=' + JSON.stringify(obj));
            eventFire(document.getElementById('image-upload'), 'click');
        }
        Contacts.create = function () {
            console.log('create obj=[' + JSON.stringify(Contacts.contactname) + ']');
            var obj = {
                Name: Contacts.contactname,
                SmallImage: 'images/nouserpic-50.png',
                LargeImage: 'images/nouserpic-225.png',
                showclass: 'noshow',
                editclass: 'show',
                direction: 'up',
                operation: 'create'
            };
            obj.Key = Contacts.getKey(obj);
            if (Contacts.contactname.length <= 0) {
                alert('Name must be entered!');
            } else
            if (Contacts.exists(obj) == true) {
                alert('Name already exists!');
            } else {
                Contacts.sendData(obj, function (data) {
                    console.log('sendData response=' + JSON.stringify(data));
                    if (data.status === 'Error') {
                        alert(data.message);
                    } else
                    if (Contacts.addToHashMap(obj) == true) {
                        Contacts.objects.unshift(obj);
                        Contacts.update();
                        try {
                            $('#' + obj.Key).show();
                        } catch (e) {}
                    } else {
                        alert('Error, unable to save to local hash map!');
                    }
                }, function (msg) {
                    alert(msg);
                });
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
        Contacts.objects = [];
        Contacts.hashmap = [];
        Contacts.addToHashMap = function (obj) {
            var ret = false;
            if (Contacts.exists(obj) == true) {
            } else {
                obj.Key = Contacts.getKey(obj);
                Contacts.hashmap[obj.Key] = obj;
                ret = true;
            }
            return (ret);
        }
        Contacts.removeFromHashMap = function (obj) {
            try {
                delete (Contacts.hashmap[obj.Key]);
            } catch (e) {
                console.log('remove' + e.toString());
            }
        }
    }]);
}

function showAttrs() {
    //get data-for attribute
    Contacts.show($(this));
}

function hideAllPanels() {
    var panels = document.getElementsByClassName('user-infos');
    for (var i = 0; i < panels.length; i++) {
        $(panels[i]).hide();
    }
}

$(document).ready(function() {
    hideAllPanels();

    //var panelsButton = $('.dropdown-user');
    //Click dropdown
    //panelsButton.click(showAttrs);

    $('[data-toggle="tooltip"]').tooltip();

    $('button').click(function(e) {
        e.preventDefault();
    });

    window.setTimeout(initContacts, 0);

});

function initContacts() {
    Contacts.sendData({
        operation: 'retrieve'
    }, function (data) {
        //console.log(JSON.stringify(data));
        Contacts.objects = data;
        Contacts.objects.forEach( function (obj) {
            obj.editclass = 'noshow';
            obj.showclass = 'show';
            obj.direction = 'down';
            delete (obj['$$hashKey']);
            Contacts.addToHashMap(obj);
        });
        Contacts.update();
        window.setTimeout(initImages, 0);
    }, function (err) {
        //alert('Unable to retrieve contacts; ' + err);
        window.setTimeout(initContacts, 2000);
    });
}
function initImages() {
    console.log('initImages ... z');
    Contacts.objects.forEach( function (obj) {
        try {
            var tag = '#' + obj.Key;
            console.log(tag);
            $(tag).hide();

        } catch (e) {
            console.log(e.toString());
        }
    });
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

 function previewFile(){
       //var preview = document.querySelector('.img-' + obj.Key); //selects the query named img
       //var file    = document.querySelector('input[type=file]').files[0]; //sames as here
       var reader  = new FileReader();

       reader.onloadend = function () {
           //preview.src = reader.result;
       }
        console.log('previewFile()');
  }

  previewFile();  //calls the function named previewFi

function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}
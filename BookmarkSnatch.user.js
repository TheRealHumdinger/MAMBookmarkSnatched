// ==UserScript==
// @name MAM Bookmark Snatched
// @namespace Humdinger
// @author Humdinger
// @description Adds option to bookmark statisfied and unsatisfied snatches
// @icon https://cdn.myanonamouse.net/imagebucket/204586/MouseyIcon.png
// @run-at       document-finish
// @match        https://www.myanonamouse.net/snatch_summary.php
// @version 0.0.2
// @license MIT
// @homepage     https://github.com/TheRealHumdinger/MAMBookmarkSnatched
// @downloadURL https://raw.githubusercontent.com/TheRealHumdinger/MAMBookmarkSnatched/main/BookmarkSnatch.user.js
// @updateURL https://raw.githubusercontent.com/TheRealHumdinger/MAMBookmarkSnatched/main/BookmarkSnatch.user.js
// ==/UserScript==
// Icon Image by https://www.freepik.com/free-vector/flat-mice-collection-with-different-poses_1593656.htm#query=cute%20mouse&position=0&from_view=keyword&track=ais

// This script works well and is tested in Firefox.  I am not so sure about Chrome.
// I know it used to cause a problem with sorting your snatch list in Chrome but I think a change in how I added elements to the page corrected that.
// But I haven't actually tested in Chrome since then.

// There doesn't seem to be a really great way to search your already snatched/seeded items (more of a problem when you're seeding a few metric tons)

// In order to add them you must enumerate them all first so you have to expand them (and if you have a lot it'll take some serious time.. Romey, I'm looking at you)
// For the unsat list it just does them all so uses a different function call.
// For satisfied it has a batch size and wait time between executing each batch.
// I have found 200 to be a good batch size and a half second pause between batches to be not-too-unreasonable.
// I added the pause to try to alleviate load on the server(s).. especially from hoarders like me.
// Try not to mess with the pause too much, I don't want to upset the sysops.

// After doing this you can search your snatched via bookmarks like you would any other torrent

var brElement = document.createElement('br');
var bookmarkUnsatSpan = document.createElement('span');
var openBracket = document.createTextNode("[");
var closeBracket = document.createTextNode("]");

bookmarkUnsatSpan.classList = "forumLink";
bookmarkUnsatSpan.innerHTML = "Bookmark Unsats: ";

var aBookmarkUnsat = document.createElement('a');
aBookmarkUnsat.id = 'bookmarkUnsats';
aBookmarkUnsat.onclick = function() {
            document.getElementById("bookmarkUnsats").innerHTML = "Adding to Bookmarks";
            var debug = true;
            var logPrefix = "[MAMSnatchBookmarks] ";

            let data = { add: [] };
            var unsatDiv = document.getElementById('unsat');
            var unsatLinks = unsatDiv.getElementsByClassName('torTitle');
            if ( debug ) { console.log(logPrefix + "Unsatisfied Links found: " + unsatLinks.length); }

            for (var i = 0; i < unsatLinks.length; i++) {
                data.add.push(unsatLinks[i].toString().split('/')[4]);
            }
            doBookmarkMass(data);
            document.getElementById("bookmarkUnsats").innerHTML = "Completed adding to Bookmarks";
        };

aBookmarkUnsat.innerHTML = "Everything";

var divUnsat = document.getElementById("aunsat").parentElement;
divUnsat.insertBefore(brElement, divUnsat.children[12]);
divUnsat.insertBefore(bookmarkUnsatSpan, divUnsat.children[13]);
divUnsat.insertBefore(openBracket, divUnsat.children[14]);
divUnsat.insertBefore(aBookmarkUnsat, divUnsat.children[14]);
divUnsat.insertBefore(closeBracket, divUnsat.children[15]);

var brElement2 = document.createElement('br');
var openBracket2 = document.createTextNode("[");
var closeBracket2 = document.createTextNode("]");
var bookmarkSatSpan = document.createElement('span');
bookmarkSatSpan.classList = "forumLink";
bookmarkSatSpan.innerHTML = "Bookmark Satisfied: ";

var aBookmarkSat = document.createElement('a');
aBookmarkSat.id = 'bookmarkSats';
aBookmarkSat.onclick = async function bookmarkSats() {
            alert("Beginning to add satisfied bookmarks (Could take awhile if you have a lot).");
            document.getElementById("bookmarkSats").innerHTML = "Adding to Bookmarks";

            var batchSize = 200;
            var waitms = 500;

            var debug = true;
            var logPrefix = "[MAMSnatchBookmarks] ";

            var satDiv = document.getElementById('kasSat');
            var satLinks = satDiv.getElementsByClassName('torTitle');
            if ( debug ) { console.log(logPrefix + "Satisfied Links found: " + satLinks.length); }

            for (var i = 0; i < satLinks.length; i = i + batchSize) {
                let data = { add: [] };
                for (var j = 0; j + i < satLinks.length && j < batchSize; j++) {
                    data.add.push(satLinks[j + i].toString().split('/')[4]);
                }
                doBookmarkMass(data);
                await new Promise(r => setTimeout(r, waitms));
            }
            document.getElementById("bookmarkSats").innerHTML = "Completed adding to Bookmarks";
        };

aBookmarkSat.innerHTML = "Everything";

var divSat = document.getElementById("asSat").parentElement;
divSat.insertBefore(brElement2, divSat.children[15]);
divSat.insertBefore(bookmarkSatSpan, divSat.children[16]);
divSat.insertBefore(openBracket2, divSat.children[17]);
divSat.insertBefore(aBookmarkSat, divSat.children[17]);
divSat.insertBefore(closeBracket2, divSat.children[18]);

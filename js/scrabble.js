/*
File: scrabble.js
HW 5 GUI Assignment: scrabble
Steven Ceballos, UMass Lowell Computer Science, steven_ceballos@student.uml.edu
December 7, 2022 at 1:43 PM     
*/

/*  File:  /~heines/91.461/91.461-2015-16f/461-assn/Scrabble_Pieces_AssociativeArray_Jesse.js
 *  Jesse M. Heines, UMass Lowell Computer Science, heines@cs.uml.edu
 *  Copyright (c) 2015 by Jesse M. Heines.  All rights reserved.  May be freely 
 *    copied or excerpted for educational purposes with credit to the author.
 *  updated by JMH on November 21, 2015 at 10:27 AM
 *  updated by JMH on November 25, 2015 at 10:58 AM to add the blank tile
 *  updated by JMH on November 27, 2015 at 10:22 AM to add original-distribution
 */
 
var ScrabbleTiles = [] ;
ScrabbleTiles["A"] = { "value" : 1,  "original-distribution" : 9,  "number-remaining" : 9  } ;
ScrabbleTiles["B"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["C"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["D"] = { "value" : 2,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["E"] = { "value" : 1,  "original-distribution" : 12, "number-remaining" : 12 } ;
ScrabbleTiles["F"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["G"] = { "value" : 2,  "original-distribution" : 3,  "number-remaining" : 3  } ;
ScrabbleTiles["H"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["I"] = { "value" : 1,  "original-distribution" : 9,  "number-remaining" : 9  } ;
ScrabbleTiles["J"] = { "value" : 8,  "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["K"] = { "value" : 5,  "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["L"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["M"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["N"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  } ;
ScrabbleTiles["O"] = { "value" : 1,  "original-distribution" : 8,  "number-remaining" : 8  } ;
ScrabbleTiles["P"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["Q"] = { "value" : 10, "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["R"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  } ;
ScrabbleTiles["S"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["T"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  } ;
ScrabbleTiles["U"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["V"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["W"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["X"] = { "value" : 8,  "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["Y"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["Z"] = { "value" : 10, "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["_"] = { "value" : 0,  "original-distribution" : 2,  "number-remaining" : 2  } ;

var totalScore = 0;

// tile rack is set up when page executes call
$(function() {
    setup();
});

// build HTML for the starting tile rack
function setup() {
    var toMakeDroppable = ["1", "2", "3", "4", "5", "6", "7", "exchange", "tileRack"];
    var letter;
    var tileRackHTML;
    for(var i = 0; i < 7; i++) {
        letter = getRandomLetter();

        tileRackHTML = $("<img id=\"" + letter + "\" class=\"draggable\" src=\"other/images/Scrabble_Tile_" + letter + ".jpg\">");
        $("#tileRack").append(tileRackHTML);

        // give all tiles the draggable attribute and all squares droppable
        makeDraggable(tileRackHTML);
        makeDroppable(toMakeDroppable[i]);
    }

    // make exchange box and tile rack droppable
    makeDroppableExchange(toMakeDroppable[7]);
    makeDroppableRack(toMakeDroppable[8]);

    displayTilesRemaining();
}
//function for randomization of letters
function getRandomLetter() {
    var tiles = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
    var randomNum;
    var letter;
    do {
        randomNum = Math.floor(Math.random() * 27);
        letter = tiles[randomNum];
    } while(ScrabbleTiles[letter]["number-remaining"] == 0);

    ScrabbleTiles[letter]["number-remaining"] -= 1;

    return letter;
}

function submitWord() {
    // see which squares have tiles in them
    var activeSquares = document.getElementsByClassName("active_square");
    var activeSquareIDs = [];
    for (var i = 0; i < activeSquares.length; i++) {
        activeSquareIDs[i] = activeSquares[i].id;
    }
    gap = checkGap(activeSquareIDs);

    if (gap == true) {
        console.log("There is a gap.");
        $("#errorMessage").html("There is a gap in your word.")
        return;
    }
    else {
        $("#errorMessage").html("")
    }

    // get the ids of all the normal tiles and bonus tiles that are being used on the board
    var activeTiles = document.getElementsByClassName("in_droppable_object");
    var activeTileIDs = [];
    for (var i = 0; i < activeTiles.length; i++) {
        activeTileIDs[i] = activeTiles[i].id;
    }

    var activeBonus = document.getElementsByClassName("active_bonus");
    var activeBonusIDs = [];
    for(var i = 0; i < activeBonus.length; i++) {
        activeBonusIDs[i] = activeBonus[i].id;
    }

    // adjust the multiplier based on the bonus squares
    var multiplier = 1;
    if (activeBonus.length == 1) {
        multiplier = 2;
        $("#" + activeBonusIDs[0]).removeClass("active_bonus");
    }
    else if (activeBonus.length == 2) {
        multiplier = 4;
        $("#" + activeBonusIDs[0]).removeClass("active_bonus");
        $("#" + activeBonusIDs[1]).removeClass("active_bonus");
    }

    // calcualte score based on tile values and update square class to show not active
    var score = 0;
    for (var i = 0; i < activeTileIDs.length; i++) {
        score += ScrabbleTiles[activeTileIDs[i]]["value"];

        $("#" + activeSquareIDs[i]).removeClass("active_square");
    }

    // remove all of the tiles that were used
    $(".in_droppable_object").remove();

    score *= multiplier;

    totalScore += score;
    $("#score").html("Score = " + totalScore + " (+" + score + ")");

    // fill up the tile rack based on the remaining tiles
    var remainingTiles = calcTilesRemaining();
    if (activeTileIDs.length > remainingTiles) {
        for (var i = 0; i < remainingTiles; i++) {
            letter = getRandomLetter();

            tileRackHTML = $("<img id=\"" + letter + "\" class=\"draggable\" src=\"other/images/Scrabble_Tile_" + letter + ".jpg\">");
            $("#tileRack").append(tileRackHTML);

            // make the new tiles draggable
            makeDraggable(tileRackHTML);
        }
    }
    else {
        for (var i = 0; i < activeTileIDs.length; i++) {
            letter = getRandomLetter();

            tileRackHTML = $("<img id=\"" + letter + "\" class=\"draggable\" src=\"other/images/Scrabble_Tile_" + letter + ".jpg\">");
            $("#tileRack").append(tileRackHTML);

            // make the new tiles draggable
            makeDraggable(tileRackHTML);
        }
    }

    displayTilesRemaining();
}

function checkGap(activeSquareIDs) {
    var idNums = [];
    // get number values from the square ids
    for (var i = 0; i < activeSquareIDs.length; i++) {
        idNums[i] = parseInt(activeSquareIDs[i]);
    }

    for (var i = 1; i < idNums.length; i++) {
        if (idNums[i] - idNums[i-1] != 1) {
            // this means there is a gap
            return true;
        }
    }

    return false;
}

function makeDraggable(tile) {
    // makes the tile draggable objects
    tile.draggable({
        // gives stack property to draggable objects
        stack: ".draggable",

        // makes tile go back to original position if not dropped in valid droppable object
        revert: "invalid"
    });
}

function makeDroppable(square) {
    // makes board square droppable objects
    $("#" + square).droppable({
        // triggered when a tile gets dropped into a square
        drop: function(event, ui) {
            var squareIDin = $(this).attr("id");
            if (squareIDin == "2" || squareIDin == "6") {
                $(this).addClass("active_bonus");
            }

            if (squareIDin != "exchange") {
                $(this).addClass("active_square");
            }

            // updates class of tile to show it is currently in a square
            ui.draggable.addClass("in_droppable_object");
            
            // this part handles swapping tiles
            var tileID = ui.draggable.attr("id");
            if (squareIDin == "exchangeTile") {
                $("#" + tileID).addClass("remove");
                $(".remove").remove();
                ScrabbleTiles[tileID]["number-remaining"] += 1;

                letter = getRandomLetter();
                tileHTML = $("<img id=\"" + letter + "\" class=\"draggable\" src=\"other/images/Scrabble_Tile_" + letter + ".jpg\">");
                $("#tileRack").append(tileHTML);
                makeDraggable(tileHTML);
            }
        },
        // triggered when a tile gets moved out of a square
        out: function(event, ui) {
            var squareIDout = $(this).attr("id");
            if (squareIDout == "2bonusSquare" || squareIDout == "6bonusSquare") {
                $(this).removeClass("active_bonus");
            }

            // update class of square to show there is no longer a tile in it
            $(this).removeClass("active_square");

            // updates class of tile to show it is no longer in a square
            ui.draggable.removeClass("in_droppable_object");
        },

        // adds class to highlight square when hovering over it
        hoverClass: "drop-hover"
    });
}

function makeDroppableRack(square) {
    // makes board square droppable objects
    $("#" + square).droppable({
        // adds class to highlight square when hovering over it
        hoverClass: "drop-hover-rack"
    });
}

function makeDroppableExchange(square) {
    // makes board square droppable objects
    $("#" + square).droppable({
        // triggered when a tile gets dropped into a square
        drop: function(event, ui) {
            // this part handles swapping tiles
            var tileID = ui.draggable.attr("id");
            var squareIDin = $(this).attr("id");
            if (squareIDin == "exchange") {
                $("#" + tileID).addClass("remove");
                $(".remove").remove();
                ScrabbleTiles[tileID]["number-remaining"] += 1;

                letter = getRandomLetter();
                tileHTML = $("<img id=\"" + letter + "\" class=\"draggable\" src=\"other/images/Scrabble_Tile_" + letter + ".jpg\">");
                $("#tileRack").append(tileHTML);
                makeDraggable(tileHTML);
            }
        },

        // adds class to highlight square when hovering over it
        hoverClass: "drop-hover-exchange"
    });
}

function calcTilesRemaining() {
    var tiles = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
    var letter;
    var tilesRemaining = 0;
    for (var i = 0; i < 27; i++) {
        letter = tiles[i];
        tilesRemaining += ScrabbleTiles[letter]["number-remaining"];
    }

    return tilesRemaining;
}

function displayTilesRemaining() {
    var remainingTiles = calcTilesRemaining();
    $("#tilesRemaining").html("Remaining Tiles = " + remainingTiles);
}

function resetGame() {
    totalScore = 0;
     $("#score").html("Score = " + totalScore);

    // remove all tiles
    $(".draggable").remove();

    resetTileCount();

    setup();
}

// changes the associative array back to its original state, resetting the tile count
function resetTileCount() {
    var tiles = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
    var letter; 

    for (var i = 0; i < 27; i++) {
        letter = tiles[i];
        ScrabbleTiles[letter]["number-remaining"] = ScrabbleTiles[letter]["original-distribution"];
    }
}
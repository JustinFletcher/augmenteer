/**
 * Created by Justin Fletcher on 12/27/2014.
 */

/*global $:false*/


// There could be constructed a search algorithm, which goes depth-first one way, until it can go another, then flips
// back until it reaches and end. Control could then flow back through the tree. This algorithm would visit each node.
function recursiveOneWayDepthFirstSearch($rootTask) {

}

function recursiveUpdateAntecedentsPositions($rootTask) {
    // This function implements a recursive depth-first search starting at a given node and searching through the
    // antecedent space. On each node, an evaluation is performed to determine id the current node should be above or
    // below the next-lowest-recursive-depth root node. Based on that evaluation, an operation is performed, or not.

    // First, generate all antecedents of the root task
    $rootTask.antecedents().forEach(function ($rootTaskAntecedent) {
        var rootTaskSiblingArray = $rootTaskAntecedent.subsequents();
        rootTaskSiblingArray.forEach(function ($rootTaskSibling) {
            // If sibling is below root, lower that sibling by 100 pixels
            if ($rootTask.position().top < $rootTaskSibling.position().top) {
                recursiveOffsetSubsequentPosition($rootTaskSibling, 100, 0, []);
            }
        });
        recursiveUpdateAntecedentsPositions($rootTaskAntecedent);
    });
}

function updateTaskTreePositions($appendeeTask) {
    // this function could evolve into a triggerable which would dispatch all position update for the tree...
    // For now, this function is called to update the position of all antecedents of some appendee, if needed.
    ($appendeeTask.subsequents('count') > 1) ? recursiveUpdateAntecedentsPositions($appendeeTask) : null;

}

function recursiveOffsetSubsequentPosition($rootTask, topOffset, leftOffset, adjustCompleteArray) {

    // If the explored set (adjustCompleteArray) doesn't contain the $rootNode, then adjust the nodes position and add
    if ($.inArray($rootTask, adjustCompleteArray) === -1) {
        offset$ElementPosition($rootTask, topOffset, leftOffset);
        adjustCompleteArray.push($rootTask);
    }

    // Generate the frontier, which consists of subsequents.
    var rootTaskSubsequentsArray = $rootTask.subsequents();

    // Iterate over each of the frontier members, and recursively call this function, thereby implementing a recursive,
    // one-way, depth-first search of the subsequent space.
    rootTaskSubsequentsArray.forEach(
        function ($subsequentTask) {
            recursiveOffsetSubsequentPosition($subsequentTask, topOffset, leftOffset, adjustCompleteArray);
        }
    );
}

function getSubsequentsSortedByAltitude($rootTask) {
    //var rootTaskId = $rootTask.attr('id');

    var taskIdSortedByAltitudeArray = recursiveSortSubsequentsByAltitude($rootTask, []);

    taskIdSortedByAltitudeArray.sort(function (a, b) {return b[1] - a[1]; });

    return taskIdSortedByAltitudeArray;

    function recursiveSortSubsequentsByAltitude($rootTask, taskIdSortedByAltitudeArray) {

        //var $rootTask = $("#" + rootTaskId);

        var rootTop = $rootTask.timeInvariantPositionTop();
        taskIdSortedByAltitudeArray.push([$rootTask.attr('id'), rootTop]);

        var rootTaskSubsequentsArray = $rootTask.subsequents();

        rootTaskSubsequentsArray.forEach(
            function ($subsequentsTask) {
                //var subsequentsTaskId = arrayElement;
                taskIdSortedByAltitudeArray = recursiveSortSubsequentsByAltitude($subsequentsTask, taskIdSortedByAltitudeArray);
            }
        );

        return taskIdSortedByAltitudeArray;
    }
}

function findIndex(key, arr) {
    for (var i=0, j=arr.length; i<j; i++)
    {
        if(arr[i].hasOwnProperty(key))
        {
            return i;
        }
    }
    return -1;
}

function recursiveTreeWalk($rootnode, relationDirection, fcn, oncePerNode) {
    // Not a bad idea, but it needs to allow for return values that come after the recursive call. It also must allow
    // for a function to have some sort of persistent variable, such as an array, through the call-chain.
    var rootTaskRelationArray = [];

    fcn($rootnode);

    if (relationDirection === 'subsequents') {
        rootTaskRelationArray = $rootnode.subsequents();
    } else if (relationDirection === 'antecedents') {
        rootTaskRelationArray = $rootnode.antecedents();
    }
    // There must be an option for 'both' here...

    rootTaskRelationArray.forEach(
        function(arrayElement){
            var $relationTask = $('#' + arrayElement); // Can eliminate for speed if needed.
            recursiveTreeWalk($relationTask, relationDirection, fcn);
        }
    );
}

function recursiveVerticallyCenter$ElementOnSubsequents($rootTask) {

    verticallyCenter$ElementOnSubsequents($rootTask);

    var rootTaskAntecedentsArray = $rootTask.antecedents();

    rootTaskAntecedentsArray.forEach(
        function($antecedentTask){
            //var $antecedentTask = $('#' + arrayElement); // Can eliminate for speed if needed.
            recursiveVerticallyCenter$ElementOnSubsequents($antecedentTask) ;
        }
    );
}

function verticallyCenter$ElementOnSubsequents($elementToCenter) {
    //Refactor to be independent of array order.
    var firstSubsequent = $elementToCenter.subsequents(0);
    var highestSubsequent = firstSubsequent.timeInvariantPositionTop();
    var lowestSubsequent = firstSubsequent.timeInvariantPositionTop();

    // Compute the highest and lowest subsequents
    $elementToCenter.subsequents().forEach(
        function($thisSubsequent) {

                var thisSubsequentTop = $thisSubsequent.timeInvariantPositionTop();

                if(thisSubsequentTop < highestSubsequent)
                {
                    highestSubsequent = thisSubsequentTop;
                }
                else if(thisSubsequentTop > lowestSubsequent)
                {
                    lowestSubsequent = thisSubsequentTop;
                }

            });

    var centereeTop = highestSubsequent+((lowestSubsequent-highestSubsequent)/2);
    //console.log("rangeTop: " + highestSubsequent +" | rangeBottom: "+lowestSubsequent+" | centereeTop: "+centereeTop);
    set$ElementPosition($elementToCenter, centereeTop, $elementToCenter.timeInvariantPositionLeft())
}

function set$ElementPosition($element, top, left){

    $element.css('position', 'absolute');

    $element.timeInvariantPositionTop(top);
    $element.timeInvariantPositionLeft(left);

    var moveTimer = setInterval(function () {
        $element.trigger('task-moved');
        console.log("position timer running");
    }, 1);
    setTimeout(function () {clearInterval(moveTimer); }, 250);

    $element.animate(
        {
            top: (top) + 'px',
            left: (left) + 'px'
        },
        250);
}

function offset$ElementPosition($element, top, left){

    $element.css('position', 'absolute');

    var newtop = ($element.position().top + top);
    var newleft = ($element.position().left + left);

    $element.timeInvariantPositionTop(newtop);
    $element.timeInvariantPositionLeft(newleft);

    var offsetTimer = setInterval(function () {
        $element.trigger('task-moved');
        console.log("offset timer running");
    }, 1);
    setTimeout(function () {clearInterval(offsetTimer); }, 500);

    $element.animate(
        {
            top: newtop + 'px',
            left: newleft + 'px'
        },
        250);
}

jQuery.fn.extend({
    timeInvariantPositionLeft: function() {
        if (arguments.length == 1 ) {
            this.data('time-invariant-left', arguments[0]);
        } else {
            return this.data('time-invariant-left');
        }
    },
    timeInvariantPositionTop: function () {
        if (arguments.length == 1 ) {
            this.data('time-invariant-top', arguments[0]);
        } else {
            return this.data('time-invariant-top');
        }
    }
});

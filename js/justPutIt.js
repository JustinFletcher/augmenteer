/**
 * Created by Justin Fletcher on 12/27/2014.
 */


function recursiveUpdateAntecedentsPositions($rootTask) {

    var rootTaskAntecedentIdArray = $rootTask.antecedents();

    rootTaskAntecedentIdArray.forEach(
        function (arrayElement) {
            // Determine exactly at which antecedent task we are looking.
            var rootTaskAntecedentId = arrayElement;
            var $rootTaskAntecedent = $('#' + rootTaskAntecedentId);

            // Pull the list of subsequent tasks of this iterations antecedent of the appendee task. This list will
            // always include the appendee task.
            var rootTaskSiblingIdArray = $rootTaskAntecedent.subsequents();

            // Determine the list-index of the appendee task relative to this antecedent.
            var rootTaskId = $rootTask.attr('id');
            var antecedentSpecificRootTaskIndex = rootTaskSiblingIdArray.indexOf(rootTaskId);

            rootTaskSiblingIdArray.forEach(
                function (arrayElement, elementIndex) {
                    // This algorithm need to be refactored to work based on position in space, rather than order in
                    // array, so that the array order is decoupled from the position completely.
                    var rootTaskSiblingId = arrayElement;
                    var rootTaskSiblingIndex = elementIndex;

                    // If this number is positive the appendee is above this iterations sibling, if the number is
                    // negative it's below, if it's zero it IS the appendee.
                    var appendeeToSiblingDistance =  antecedentSpecificRootTaskIndex - rootTaskSiblingIndex;

                    if (appendeeToSiblingDistance < 0) {
                        recursiveAdjustDependentHeight(rootTaskSiblingId, 100, []);
                    }
                }
            );
            recursiveUpdateAntecedentsPositions($rootTaskAntecedent);
        }
    );
}

function updateTaskTreePositions($appendeeTask) {
    ($appendeeTask.subsequents('count') > 1) ? recursiveUpdateAntecedentsPositions($appendeeTask) : null;
}

function recursiveAdjustDependentHeight(rootTaskId, heightAdjustment, adjustCompleteArray) {

    var $rootTask = $("#" + rootTaskId);

    if (adjustCompleteArray.indexOf(rootTaskId) === -1) {
        offset$ElementPosition($rootTask, heightAdjustment, 0);
        adjustCompleteArray.push(rootTaskId);
    }

    var rootTaskDependentArray = $rootTask.subsequents();

    rootTaskDependentArray.forEach(
        function (arrayElement) {
            var dependentTaskId = arrayElement; // Can eliminate for speed if needed.
            recursiveAdjustDependentHeight(dependentTaskId, heightAdjustment, adjustCompleteArray);
        }
    );
}

function getSubsequentsSortedByAltitude(rootTask) {
    var rootTaskId = rootTask.attr('id');

    var taskIdSortedByAltitudeArray = recursiveSortSubsequentsByAltitude(rootTaskId, []);

    taskIdSortedByAltitudeArray.sort(function (a, b) {return b[1] - a[1]; });

    return taskIdSortedByAltitudeArray;

    function recursiveSortSubsequentsByAltitude(rootTaskId, taskIdSortedByAltitudeArray) {

        var $rootTask = $("#" + rootTaskId);

        var rootTop = $rootTask.timeInvariantPositionTop();
        taskIdSortedByAltitudeArray.push([rootTaskId, rootTop]);

        var rootTaskSubsequentsArray = $rootTask.subsequents();

        rootTaskSubsequentsArray.forEach(
            function (arrayElement) {
                var subsequentsTaskId = arrayElement;
                taskIdSortedByAltitudeArray = recursiveSortSubsequentsByAltitude(subsequentsTaskId, taskIdSortedByAltitudeArray);
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
        function(arrayElement){
            var $antecedentTask = $('#' + arrayElement); // Can eliminate for speed if needed.
            recursiveVerticallyCenter$ElementOnSubsequents( $antecedentTask ) ;
        }
    );
}

function verticallyCenter$ElementOnSubsequents($elementToCenter) {
    //Refactor to be independent of array order.
    var firstSubsequent = $elementToCenter.subsequents(0);
    var highestSubsequent = firstSubsequent.timeInvariantPositionTop();
    var lowestSubsequent = firstSubsequent.timeInvariantPositionTop();

    // Compute the highest and lowest subsequents
    $elementToCenter.subsequents().forEach(function(arrayElement)
    {

        var thisSubsequentTop = $('#'+arrayElement).timeInvariantPositionTop();

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
    setTimeout(function () {clearInterval(offsetTimer); }, 250);

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

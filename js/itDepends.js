/**
 * Created by Justin Fletcher on 12/27/2014.
 * This library implements generic dependency trees by extending jQuery using the .data() interface.
 */

jQuery.fn.extend({
    // jQuery extensions for handling dependency trees.
    antecedents: function()
    {
        if (arguments.length == 0)
        {
            return (typeof this.data('antecedents') === 'undefined') ? [] : this.data('antecedents');
        }
        if (arguments.length == 1)
        {
            if (arguments[0] == 'count')
            {
                return this.data('antecedents').length;
            }
            if (arguments[0] == 'last')
            {
                return $('#'+(this.data('antecedents')[this.data('antecedents').length-1]))
            }
            else if (typeof arguments[0] == 'number')
            {
                return $('#'+(this.data('antecedents')[arguments[0]]));
            }
        }
        else if (arguments[0] == 'add')
        {
            var antecedentTaskIdStr = arguments[1].attr('id');
            var antecedentsArray = this.data('antecedents');
            if (antecedentsArray) {
                antecedentsArray.push(antecedentTaskIdStr);
            }
            else {
                antecedentsArray = [antecedentTaskIdStr];
            }
            this.data('antecedents', antecedentsArray);
        }
        else if (arguments[0] == 'remove')
        {
            var removeTaskIdStr = arguments[0];
            var antecedentsArray = this.data('antecedents');
            antecedentsArray.splice(antecedentsArray.indexOf(removeTaskIdStr),1);
            this.data('antecedents', antecedentsArray);
        }
        else if (arguments[0] == 'lowest')
        {
            //Get the lowest
        }

    },
    // Need to extend $().antecedents() w/ .lowest() & .highest()

    subsequents: function()
    {

        if (arguments.length == 0)
        {
            // return this.data('subsequents');
            return (typeof this.data('subsequents') === 'undefined') ? [] : this.data('subsequents');
        }
        if (arguments.length == 1)
        {
            if (arguments[0] == 'count')
            {
                return this.data('subsequents').length;
            }
            else if (typeof arguments[0] == 'number')
            {
                return $('#'+(this.data('subsequents')[arguments[0]]));
            }
            if (arguments[0] == 'last')
            {
                return $('#'+(this.data('subsequents')[this.data('subsequents').length-1]));
            }
        }
        else if (arguments[0] == 'add')
        {
            var subsequentTaskIdStr = arguments[1].attr('id');
            var subsequentsArray = this.data('subsequents');
            if (subsequentsArray) {
                subsequentsArray.push(subsequentTaskIdStr);
            }
            else {
                subsequentsArray = [subsequentTaskIdStr];
            }
            this.data('subsequents', subsequentsArray);
        }
        else if (arguments[0] == 'remove')
        {
            var removeTaskIdStr = arguments[0];
            var subsequentsArray = this.data('subsequents');
            subsequentsArray.splice(subsequentsArray.indexOf(removeTaskIdStr),1);
            this.data('subsequents', subsequentsArray);
        }

    }

});

(function (module) {

    var Condition = function (op, l, r, i, negate) {
        this.op = op.trim();
        this.lvalue = l;
        this.rvalue = r;
        this.index = i;
        this.negate = negate;
    };

    Condition.prototype = {
        type: "Condition",
        accept: function (visitor) {
            this.lvalue = visitor.visit(this.lvalue);
            this.rvalue = visitor.visit(this.rvalue);
        },
        eval: function (env) {
            var a = this.lvalue.eval(env),
                b = this.rvalue.eval(env);
            var i = this.index, result;
            var result = (function (op) {
                switch (op) {
                    case 'and':
                        return a && b;
                    case 'or':
                        return a || b;
                    default:
                        if (a.compare) {
                            result = a.compare(b);
                        } else if (b.compare) {
                            result = b.compare(a);
                        } else {
                            throw { type: "Type",
                                    message: "Unable to perform comparison",
                                    index: i };
                        }
                        switch (result) {
                            case -1: return op === '<' || op === '=<';
                            case  0: return op === '=' || op === '>=' || op === '=<';
                            case  1: return op === '>' || op === '>=';
                        }
                }
            })(this.op);
            return this.negate ? !result : result;
        }
    };

    module.exports = Condition;

})(module);

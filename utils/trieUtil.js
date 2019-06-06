function TrieUtil() {
    this.words = 0;
    this.prefixes = 0;
    this.value = "";
    this.children = [];
}
TrieUtil.prototype.addValue = function (item, index) {
    if (!index) {
        index = 0;
    }
    if (item === null) {
        return;
    }
    var isObject = false;
    if (typeof item === 'object') {
        isObject = true;
    }
    if (isObject && item.key.length === 0) {
        return;
    } else if (!isObject && item.length === 0) {
        return;
    }
    if ((isObject && index === item.key.length) || (!isObject && index === item.length)) {
        this.words++;
        this.value = isObject ? item.value : item;
        return;
    }
    this.prefixes++;
    var key = isObject ? item.key[index] : item[index];
    if (this.children[key] === undefined) {
        this.children[key] = new TrieUtil();
    }
    var child = this.children[key];
    child.addValue(item, index + 1);


};
TrieUtil.prototype.removeValue = function (item, index) {
    if (!index) {
        index = 0;
    }
    if (item.length === 0) {
        return;
    }
    if (index === item.length) {
        this.words--;
        this.value = "";
    } else {
        this.prefixes--;
        var key = item[index],
            child = this.children[key];
        if (child) child.removeValue(item, index + 1);
        if (index === (item.length - 1)) {
            if (Object.keys(child.children).length === 0) {
                delete this.children[key];
            }
        }
    }
};

TrieUtil.prototype.wordCount = function (value, index) {
    if (!index) {
        index = 0;
    }
    if (value.length === 0) {
        return 0;
    }
    if (index === value.length) {
        return this.words;
    } else {
        var key = value[index],
            child = this.children[key];
        if (child) {
            return child.wordCount(value, index + 1);
        } else {
            return 0;
        }
    }
};

TrieUtil.prototype.prefixCount = function (prefix, index) {
    if (!index) {
        index = 0;
    }
    if (prefix.length === 0) {
        return 0;
    }
    if (index === prefix.length) {
        return this.prefixes;
    } else {
        var key = prefix[index],
            child = this.children[key];
        if (child) {
            return child.prefixCount(prefix, index + 1);
        } else {
            return 0;
        }
    }
};

TrieUtil.prototype.wordExists = function (value) {
    if (value.length === 0) {
        return false;
    }
    return this.wordCount(value) > 0;
};


TrieUtil.prototype.allChildWords = function (prefix) {
    if (!prefix) {
        prefix = '';
    }
    var words = [], tmp2, child;
    if (this.words > 0) {
        tmp2 ={};
        if (this.value.lenth === 0) {
            tmp2.key = prefix;
            tmp2.value = prefix;
            words.push(tmp2);
        } else {
            tmp2.key = prefix;
            tmp2.value = this.value;
            words.push(tmp2);
        }
    }
    for (var key in this.children) {
        var keyObj=key;
        child = this.children[keyObj];
        words = words.concat(child.allChildWords(prefix + keyObj));
    }
    return words;
};
TrieUtil.prototype.autoComplete = function (prefix, index) {
    if (!index) {
        index = 0;
    }
    if (prefix.length === 0) {
        return [];
    }
    var key = prefix[index];
    var child = this.children[key];
    if (!child) {
        return [];
    } else {
        if (index === prefix.length - 1) {
            return child.allChildWords(prefix);
        } else {
            return child.autoComplete(prefix, index + 1);
        }
    }
};
module.exports.TrieUtil= TrieUtil;


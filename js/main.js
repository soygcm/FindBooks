var AppRouter = Parse.Router.extend({
    routes:{
        '':'home'
    },
    home:function(action){
    }
});

var Book = Parse.Object.extend("Book");
var Offer = Parse.Object.extend("Offer");


function makePattern(search_string) {
    search_string = search_string.replace(/([|()[{.+*?^$\\])/g,"\\$1");
    var words = search_string.split(/\s+/);
    var length_comp = function (a,b) {
        return b.length - a.length;
    };
    words.sort(length_comp); //??

    var accent_replacer = function(chr) {
        _.find(accented, function(accent, key, list){
            if(accent.match(chr)){
                chr = accent;
                return true;
            }
        });
        return chr;
    }
    var wordsFinal = [];
    _.each(words, function(word, key, list){
        if(word.length > 1){
            word = word.replace(/\S/g, accent_replacer);
            wordsFinal.push("\\b"+word+"\\b");
        }
    });

    var regexp = wordsFinal.join("|");
    if (regexp != "") {
        return new RegExp(regexp,'g');
    }else{
        return "+";
    }
}

var accented = [
    '[Aa\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]',
    '[\u00C6\u01FC\u01E2]',
    '[\uA738\uA73A]',
    '[Bb\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]',
    '[Cc\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]',
    '[Dd\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]',
    '[\u01F1\u01C4]',
    '[\u01F2\u01C5]',
    '[Ee\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]',
    '[Ff\u24D5\uFF46\u1E1F\u0192\uA77C\u24BB\uFF26\u1E1E\u0191\uA77B]',
    '[Gg\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]',
    '[Hh\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]',
    '[Ii\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]',
    '[Jj\u24D9\uFF4A\u0135\u01F0\u0249\u24BF\uFF2A\u0134\u0248]',
    '[Kk\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]',
    '[Ll\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]',
    '[Mm\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]',
    '[Nn\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]',
    '[Oo\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]',
    '[Pp\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]',
    '[Qq\u24E0\uFF51\u024B\uA757\uA759\u24C6\uFF31\uA756\uA758\u024A]',
    '[Rr\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]',
    '[Ss\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]',
    '[Tt\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]',
    '[Uu\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]',
    '[Vv\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]',
    '[Ww\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]',
    '[Xx\u24E7\uFF58\u1E8B\u1E8D\u24CD\uFF38\u1E8A\u1E8C]',
    '[Yy\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]',
    '[Zz\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]',
    '[\u00E6\u01FD\u01E3]',
    '[\uA739\uA73B]',
    '[\u01F3\u01C6]',//dz
  ];

var accented2 = [
    '[Aa\xaa\xc0-\xc5\xe0-\xe5\u0100-\u0105\u01cd\u01ce\u0200-\u0203\u0226\u0227\u1d2c\u1d43\u1e00\u1e01\u1e9a\u1ea0-\u1ea3\u2090\u2100\u2101\u213b\u249c\u24b6\u24d0\u3371-\u3374\u3380-\u3384\u3388\u3389\u33a9-\u33af\u33c2\u33ca\u33df\u33ff\uff21\uff41]',
    '[Bb\u1d2e\u1d47\u1e02-\u1e07\u212c\u249d\u24b7\u24d1\u3374\u3385-\u3387\u33c3\u33c8\u33d4\u33dd\uff22\uff42]',
    '[Cc\xc7\xe7\u0106-\u010d\u1d9c\u2100\u2102\u2103\u2105\u2106\u212d\u216d\u217d\u249e\u24b8\u24d2\u3376\u3388\u3389\u339d\u33a0\u33a4\u33c4-\u33c7\uff23\uff43]',
    '[Dd\u010e\u010f\u01c4-\u01c6\u01f1-\u01f3\u1d30\u1d48\u1e0a-\u1e13\u2145\u2146\u216e\u217e\u249f\u24b9\u24d3\u32cf\u3372\u3377-\u3379\u3397\u33ad-\u33af\u33c5\u33c8\uff24\uff44]',
    '[Ee\xc8-\xcb\xe8-\xeb\u0112-\u011b\u0204-\u0207\u0228\u0229\u1d31\u1d49\u1e18-\u1e1b\u1eb8-\u1ebd\u2091\u2121\u212f\u2130\u2147\u24a0\u24ba\u24d4\u3250\u32cd\u32ce\uff25\uff45]',
    '[Ff\u1da0\u1e1e\u1e1f\u2109\u2131\u213b\u24a1\u24bb\u24d5\u338a-\u338c\u3399\ufb00-\ufb04\uff26\uff46]',
    '[Gg\u011c-\u0123\u01e6\u01e7\u01f4\u01f5\u1d33\u1d4d\u1e20\u1e21\u210a\u24a2\u24bc\u24d6\u32cc\u32cd\u3387\u338d-\u338f\u3393\u33ac\u33c6\u33c9\u33d2\u33ff\uff27\uff47]',
    '[Hh\u0124\u0125\u021e\u021f\u02b0\u1d34\u1e22-\u1e2b\u1e96\u210b-\u210e\u24a3\u24bd\u24d7\u32cc\u3371\u3390-\u3394\u33ca\u33cb\u33d7\uff28\uff48]',
    '[Ii\xcc-\xcf\xec-\xef\u0128-\u0130\u0132\u0133\u01cf\u01d0\u0208-\u020b\u1d35\u1d62\u1e2c\u1e2d\u1ec8-\u1ecb\u2071\u2110\u2111\u2139\u2148\u2160-\u2163\u2165-\u2168\u216a\u216b\u2170-\u2173\u2175-\u2178\u217a\u217b\u24a4\u24be\u24d8\u337a\u33cc\u33d5\ufb01\ufb03\uff29\uff49]',
    '[Jj\u0132-\u0135\u01c7-\u01cc\u01f0\u02b2\u1d36\u2149\u24a5\u24bf\u24d9\u2c7c\uff2a\uff4a]',
    '[Kk\u0136\u0137\u01e8\u01e9\u1d37\u1d4f\u1e30-\u1e35\u212a\u24a6\u24c0\u24da\u3384\u3385\u3389\u338f\u3391\u3398\u339e\u33a2\u33a6\u33aa\u33b8\u33be\u33c0\u33c6\u33cd-\u33cf\uff2b\uff4b]',
    '[Ll\u0139-\u0140\u01c7-\u01c9\u02e1\u1d38\u1e36\u1e37\u1e3a-\u1e3d\u2112\u2113\u2121\u216c\u217c\u24a7\u24c1\u24db\u32cf\u3388\u3389\u33d0-\u33d3\u33d5\u33d6\u33ff\ufb02\ufb04\uff2c\uff4c]',
    '[Mm\u1d39\u1d50\u1e3e-\u1e43\u2120\u2122\u2133\u216f\u217f\u24a8\u24c2\u24dc\u3377-\u3379\u3383\u3386\u338e\u3392\u3396\u3399-\u33a8\u33ab\u33b3\u33b7\u33b9\u33bd\u33bf\u33c1\u33c2\u33ce\u33d0\u33d4-\u33d6\u33d8\u33d9\u33de\u33df\uff2d\uff4d]',
    '[Nn\xd1\xf1\u0143-\u0149\u01ca-\u01cc\u01f8\u01f9\u1d3a\u1e44-\u1e4b\u207f\u2115\u2116\u24a9\u24c3\u24dd\u3381\u338b\u339a\u33b1\u33b5\u33bb\u33cc\u33d1\uff2e\uff4e]',
    '[Oo\xba\xd2-\xd6\xf2-\xf6\u014c-\u0151\u01a0\u01a1\u01d1\u01d2\u01ea\u01eb\u020c-\u020f\u022e\u022f\u1d3c\u1d52\u1ecc-\u1ecf\u2092\u2105\u2116\u2134\u24aa\u24c4\u24de\u3375\u33c7\u33d2\u33d6\uff2f\uff4f]',
    '[Pp\u1d3e\u1d56\u1e54-\u1e57\u2119\u24ab\u24c5\u24df\u3250\u3371\u3376\u3380\u338a\u33a9-\u33ac\u33b0\u33b4\u33ba\u33cb\u33d7-\u33da\uff30\uff50]',
    '[Qq\u211a\u24ac\u24c6\u24e0\u33c3\uff31\uff51]',
    '[Rr\u0154-\u0159\u0210-\u0213\u02b3\u1d3f\u1d63\u1e58-\u1e5b\u1e5e\u1e5f\u20a8\u211b-\u211d\u24ad\u24c7\u24e1\u32cd\u3374\u33ad-\u33af\u33da\u33db\uff32\uff52]',
    '[Ss\u015a-\u0161\u017f\u0218\u0219\u02e2\u1e60-\u1e63\u20a8\u2101\u2120\u24ae\u24c8\u24e2\u33a7\u33a8\u33ae-\u33b3\u33db\u33dc\ufb06\uff33\uff53]',
    '[Tt\u0162-\u0165\u021a\u021b\u1d40\u1d57\u1e6a-\u1e71\u1e97\u2121\u2122\u24af\u24c9\u24e3\u3250\u32cf\u3394\u33cf\ufb05\ufb06\uff34\uff54]',
    '[Uu\xd9-\xdc\xf9-\xfc\u0168-\u0173\u01af\u01b0\u01d3\u01d4\u0214-\u0217\u1d41\u1d58\u1d64\u1e72-\u1e77\u1ee4-\u1ee7\u2106\u24b0\u24ca\u24e4\u3373\u337a\uff35\uff55]',
    '[Vv\u1d5b\u1d65\u1e7c-\u1e7f\u2163-\u2167\u2173-\u2177\u24b1\u24cb\u24e5\u2c7d\u32ce\u3375\u33b4-\u33b9\u33dc\u33de\uff36\uff56]',
    '[Ww\u0174\u0175\u02b7\u1d42\u1e80-\u1e89\u1e98\u24b2\u24cc\u24e6\u33ba-\u33bf\u33dd\uff37\uff57]',
    '[Xx\u02e3\u1e8a-\u1e8d\u2093\u213b\u2168-\u216b\u2178-\u217b\u24b3\u24cd\u24e7\u33d3\uff38\uff58]',
    '[Yy\xdd\xfd\xff\u0176-\u0178\u0232\u0233\u02b8\u1e8e\u1e8f\u1e99\u1ef2-\u1ef9\u24b4\u24ce\u24e8\u33c9\uff39\uff59]',
    '[Zz\u0179-\u017e\u01f1-\u01f3\u1dbb\u1e90-\u1e95\u2124\u2128\u24b5\u24cf\u24e9\u3390-\u3394\uff3a\uff5a]'
];

function orderResults(books, query){
    // 6 palabras encontradas
    // 5 palabras encontradas sobre cantidad de palabras en el titulo
    // 4 orden de las palabras encontradas
    // 3 separacion de palabras encontradas
    // 2 busqueda exacta acentos
    // 1 busqueda exacta mayusculas
    C_FOUND = 6;
    C_ONTEXT = 5;
    C_ORDER = 4;
    C_SPACE = 3;
    C_ACCENTS = 2;
    C_CASE = 1;
    console.log(query, makePattern(query));
    queryWords = query.match(makePattern(query)); 
    _.each(books, function(book, key, list){
        book.weight = 0;
        //FOUND-----------------
        find = book.get('title').match(makePattern(query));
        found = find.length/queryWords.length;
        book.weight += found*C_FOUND;
        //ONTEXT-----------------
        // words = book.title.split(" ");
        words = book.get('title').match(/\b\w+\b/gi);
        wordsLargerOne = new Array();
        _.each(words, function(word, key, list){
            if(word.length > 1){
                wordsLargerOne.push(word);
            }
        });
        ontext = (found/wordsLargerOne.length);
        book.weight += ontext*C_ONTEXT;
        //ORDER-----------------
        console.log(book.get('title'), find);
        // wordFindAnt = "";
        order = 0;
        _.each(find, function(wordFind, key, list){
            if(key == 0){
                _.find(queryWords, function(wordQuery, keyQuery, listQuery){
                    if(wordFind.match(makePattern(wordQuery))){
                        order++;
                        return true;
                    }else if(book.get('title').match(makePattern(wordQuery))){
                        return true;
                    }
                });
            }else if(key<find.length){
                prevWord = find[key-1];
                findWord = _.find(queryWords, function(wordQuery, key, list){
                    return wordQuery.match(makePattern(wordFind));
                });
                positionQueryWord = queryWords.indexOf(findWord);
                prevWordQuery = queryWords[positionQueryWord-1];
                if (typeof(prevWordQuery) != 'undefined') {
                    equalsPrev = false;
                    equalsPrev = prevWord.match(makePattern(prevWordQuery));
                    if (equalsPrev) {
                        order++;
                    }
                }
            }else{

            }
        });
        order = order/find.length;
        book.weight += order*C_ORDER;
    });

    compare = function (a,b) {
      return b.weight - a.weight;
    }
    books.sort(compare);

    return books;

    // _.each(books, function(book, key, list){
    //     console.log(book.get('title'), book.weight);
    // });

}

// books = [
// // {title: "Gatos vivientes"},
// // {title: "La Biblia viviente"},
// // {title: "La Biblia de los gatos vivientes"},
// {title: "le siento cada ano año viviente"},
// {title: "Le cada siento año que vez vëz vez hablan mas"},
// // {title: "Ya no se me ocurre nada mas"},
// // {title: "tratando de mirar muy lejos de la"},
// ];

// termino = "Le siento cada año véz";

// orderResults(books, termino, makePattern(termino));
// // console.log(termino);

var BookCollection = Parse.Collection.extend({
    model: Book,
    query: '',
    successParse: false,
    successGoogle: false,
    initialize: function() {
        _.bindAll(this, 'url', 'fetch', 'fetchCallback');
    },
    fetch: function(options) {
        var self = this;
        self.reset();
        var options = options || {};
        $.getJSON(this.url(),{q: this.query}, 
            function(response) {
                self.fetchCallback(response, options); 
            },'jsonp');

        console.log(this.query, makePattern(this.query));
        var query = new Parse.Query(Book);
        query.matches("title", makePattern(this.query));
        query.find({
          success: function(results) {

            results = orderResults(results, self.query);

            self.add(results, {silent: true});
            self.successParse = true;
            self.success(options);
          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
    },
    success: function(options){

        if(this.successParse && this.successGoogle){

            this.trigger('change');
            options.success(this);
        }
        
    },
    fetchCallback: function(response, options) {
        var self = this;
        // self.reset();



        _.each(response.items, function(book, i) {
            newBook = new Book();
            if (typeof(book.volumeInfo.title) != "undefined"){
                newBook.set('title', book.volumeInfo.title);
            }
            if (typeof(book.volumeInfo.subtitle) != "undefined"){
                newBook.set('subtitle', book.volumeInfo.subtitle);
            }
            if (typeof(book.volumeInfo.authors) != "undefined"){
                newBook.set('authors', book.volumeInfo.authors);
            }
            if (typeof(book.volumeInfo.imageLinks) != "undefined"){
                newBook.set('thumbnails', book.volumeInfo.imageLinks);
            }
            if (typeof(book.id) != "undefined"){
                newBook.set('idGBook',  book.id);
            }
            self.add(newBook,{ silent: true }); 
        });
        
        // options.success(self);
        this.successGoogle = true;
        this.success(options);

        
    },
    url: function() {
        return "https://www.googleapis.com/books/v1/volumes";
         // + this.query;
    }
});

BookResult = Parse.View.extend({
    tagName: "li",
    className: "book-result",
    events:{
        "click":"setBookResult"
    },
    template:_.template($("#book-result-template").html()),
    render: function() {
        var modelJson = this.model.toJSON();
        modelJson.authors = modelJson.authors || [];
        modelJson.thumbnails = modelJson.thumbnails || [];
        modelJson.authors = modelJson.authors.join(", ");
        this.$el.html(this.template(modelJson));
        if(typeof(modelJson.objectId) != 'undefined'){
            this.$el.css('background-color', 'tomato');
        }
        return this;
    },
    setBookResult: function(){
        if(this.id != "book-result"){
            this.options.parent.setBookResult(this.model);
        }
    }
});

SearchGBooks = Parse.View.extend({
    searchState: 0,
    events: {
        'keyup input': 'logKey',
        'submit form.search': 'startSearch',
        'click button.erase': 'eraseResults',
    },
    countUp: 600,
    logKey: function(e) {
        // console.log(e.keyCode);
        if (this.$inputSearch.val() != "" && this.$inputSearch.val() != this.bookCollection.query) {
            if (this.searchState == 1) {
                clearTimeout(this.counting);
            }
            // console.log('iniciando conteo hasta '+this.countUp);
            self = this;
            this.counting = setTimeout(function(){
                console.log('buscando...')
                self.startSearch(e);
            },this.countUp);
            this.searchState = 1;
        }
    },
    startSearch: function(e){
        e.preventDefault();
        self = this;
        if (this.$inputSearch.val() != "" && this.$inputSearch.val() != this.bookCollection.query) {
            this.bookCollection.query = this.$inputSearch.val();
            this.bookCollection.fetch({
                success:function(collection){
                    self.$ulResults.empty();
                    console.log("Busqueda terminada");
                    _.each(collection.models, function(book, i) {
                        self.addOneResult(book);
                    });
                }
            });
        }
    },
    addOneResult: function(book){
        var bookResult = new BookResult({model: book, parent: this});
        this.$ulResults.append(bookResult.render().el);
    },
    initialize: function(){
        this.render();
    },
    render: function(){
        this.bookCollection= new BookCollection();
        this.$inputSearch= this.$('input');
        this.$ulResults= this.$('ul');
        this.$formSearchOffer= this.$('form');
        this.$btnErase= this.$('button.erase');
    },
    setBookResult: function(book){
        // console.log(book.get('title'));
        this.selectedResult = book;
        this.$formSearchOffer.hide();
        this.$ulResults.hide();
        this.$btnErase.removeClass('hidden').show();
        var bookResult = new BookResult({model: book, parent: this, id: 'book-result', tagName: 'div'});
        this.$el.append(bookResult.render().el);
    },
    eraseResults: function(){
        this.$formSearchOffer.show();
        this.$ulResults.show();
        this.$btnErase.hide();
        this.$('#book-result').remove();
    }
});



FindBooksView = Parse.View.extend({
    el: "#findbooks",
    events:{
        "click #type a":"selectType",
        'click #offer button.done': 'doneOffer',
    },
    selectType: function(e){
        e.preventDefault();
        this.type = $(e.target).data('value');
        this.$("#values > .form-group").hide();
        this.$("#values ."+this.type).show();
    },
    render: function() {
        this.findSearch =  new SearchGBooks({el:"#find>.search"});
        this.offerSearch = new SearchGBooks({el:"#offer>.search"});
        this.$("#values > div").hide();
        // this.$selectType= this.$('#type');
        this.$inputPrice= this.$('input.price');
        this.$inputMaxTime= this.$('input.max-time');
        this.$selectTimeType= this.$('select.time-type');
        this.$inputPriceTime= this.$('input.price-time');
        this.$inputEmail= this.$('input.email');
    },
    doneOffer: function(e){
        e.preventDefault();
        book = this.offerSearch.selectedResult;
        self = this;
        console.log(book);
        if (typeof(book.get('thumbnails'))!='undefined') {
            this.uploadImageBook(book, function(data, textStatus, xhr) {
                console.log(data);
                if(data.url != null){
                    book.set('picture', {"name": data.name, 'url': data.url, "__type": "File"});
                    book.save(null, {success: self.saveBookSuccess, error: self.saveError});
                }
            }); 
        }else{
            book.save(null, {success: self.saveBookSuccess, error: self.saveError});
        }
    },
    saveBookSuccess: function(book){
        self.saveOffer(book);
        self.$el.css('background-color', 'lightgreen');
    },
    saveError: function(model, error){
        console.log(error);
    },
    saveOffer: function(book){
        // e.preventDefault();
        var offer = new Offer;
        offer.set('type', this.type);
        offer.set('email', this.$inputEmail.val());
        offer.set('book', book);
        switch(this.type){
          case 'sell':
            offer.set('price', this.$inputPrice.val());
            break;
          case 'lend':
            offer.set('time', this.$inputMaxTime.val());
            offer.set('timeType', this.$selectTimeType.val());
            break;
          case 'rent':
            offer.set('priceTime', this.$inputPriceTime.val());
            offer.set('time', this.$inputMaxTime.val());
            offer.set('timeType', this.$selectTimeType.val());
            break;
        }
        offer.save();
        console.log(offer);
    },
    uploadImageBook: function(book, success){
        $.post('http://localhost/parse-services/upload-images.php',
            {   appid: appId,
                url: book.get('thumbnails').thumbnail,
                apikey: rApiKey,
                name: book.get('idGBook')
        },function(data, textStatus, xhr){
            success(data, textStatus, xhr);
        }, 'json').error(function( jqXHR, textStatus, errorThrown) {
            console.log( jqXHR, textStatus, errorThrown);
        });
    }
});

Parse.$ = jQuery;
appId = "C4zgFUST9RGWSJ5scVpyB5G4co2gcMUpNPg0QpaI";
jsKey = "C7Qy33Kz3SbWwNOoodEg6RiuIE7a4MlvoYo99kTZ";
rApiKey = "pYnV60HdDrE8moVcRWnob0RBPzgllsOzDbspc5HU";
Parse.initialize(appId, jsKey);

var appView = new FindBooksView();
var appRouter;

$(document).ready(function() {
    appView.render();
    appRouter = new AppRouter;
    Parse.history.start({pushState: true});
});



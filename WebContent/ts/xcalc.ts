﻿

/*
This JS library is made by HJOW.
E-mail : hujinone22@naver.com

This library need following libraries : jQuery, jQuery UI, BigInteger.js, hjow_common.
This library is coded as TypeScript. If this file's extension is 'js', please find 'ts' original file.

jQuery : https://jquery.com/
jQuery UI : https://jqueryui.com/
BigInteger.js : https://www.npmjs.com/package/big-integer?activeTab=readme
*/
/*
Copyright 2018 HJOW (hujinone22@naver.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var jqo: any = { // TypeScript 내에서 jQuery 사용을 위해 임시로 사용, html 파일 내에서 jq 에 jQuery 객체를 넣게 됨
    warnJQuery: function () { hjow_alert("Need jQuery to run this. Please call 'jq = $;' first."); },
    hide: function () { this.warnJQuery(); return self; },
    show: function () { this.warnJQuery(); return self; },
    css: function (a: string, b: string) { this.warnJQuery(); return self; },
    html: function (a: string) { this.warnJQuery(); return self; },
    each: function (a: any) { this.warnJQuery(); },
    find: function (a: any) { this.warnJQuery(); return self; },
    attr: function (a: string, b: string = null) { this.warnJQuery(); return ""; },
    prop: function (a: string, b: boolean = false) { this.warnJQuery(); return ""; },
    removeAttr: function (a) { this.warnJQuery(); return self; },
    removeProp: function (a) { this.warnJQuery(); return self; },
    remove: function () { this.warnJQuery(); return self; },
    append: function (a: any) { this.warnJQuery(); return self; },
    removeClass: function (a: string) { this.warnJQuery(); return self; },
    addClass: function (a: string) { this.warnJQuery(); return self; },
    val: function (a: any) { this.warnJQuery(); return ""; },
    length: 0,
    width: function (a: any) { this.warnJQuery(); return 0; },
    height: function (a: any) { this.warnJQuery(); return 0; },
    is: function (a: string) { this.warnJQuery(); return false; },
    dialog: function () { this.warnJQuery(); return self; },
    isArray: function (a: any) { this.warnJQuery(); return Array.isArray(a); },
    parent: function () { return jqo; },
    parents: function () { return jqo; }
};
var jq: Function = function (obj: Object) {
    return jqo;
};

function hjow_makeArrayCompatible(stringArr: any): any[] {
    var newArr: any[] = [];
    for (var idx = 0; idx < stringArr.length; idx++) {
        newArr.push(stringArr[idx]);
    }
    return newArr;
};

var hjow_onRefreshComponents = null;

class UtilityMethods {
    public parseBoolean(val: any): boolean {
        return hjow_parseBoolean(val);
    };
    public getSelfObject(): any {
        return this;
    };
};

class Uniqueable extends UtilityMethods {
    protected uniqueId: string = hjow_makeUniqueId('p', 4);
    public getUniqueId(): string {
        return this.uniqueId;
    }
};

class PropertiesEntry extends UtilityMethods {
    public key: string = "";
    public value: string = "";
};

class Properties extends Uniqueable {
    private entries: PropertiesEntry[] = [];
    public put(key: string, value: string) {
        if (value == null) {
            this.remove(key);
            return null;
        }

        var newEntry: PropertiesEntry = new PropertiesEntry();
        newEntry.key = key;
        newEntry.value = value;
        for (var idx: number = 0; idx < this.entries.length; idx++) {
            if (this.entries[idx].key == key) {
                this.entries[idx] = newEntry;
                return;
            }
        }
        this.entries.push(newEntry);
    };
    public set(key: any, value: any) {
        this.put(String(key), String(value));
    };
    public get(key: string) {
        for (var idx: number = 0; idx < this.entries.length; idx++) {
            if (this.entries[idx].key == key) {
                return this.entries[idx].value;
            }
        }
        return null;
    };
    public remove(key: string): string {
        var targetIdx: number = -1;
        var value: string = null;
        for (var idx: number = 0; idx < this.entries.length; idx++) {
            if (this.entries[idx].key == key) {
                targetIdx = idx;
                value = this.entries[idx].value;
                break;
            }
        }

        hjow_removeItemFromArray(this.entries, targetIdx);
        return value;
    };
    public keyList() : string[] {
        var results: string[] = [];
        for (var idx: number = 0; idx < this.entries.length; idx++) {
            results.push(this.entries[idx].key);
        }
        return results;
    };
    public clear() {
        this.entries = [];
    };
    public serialize(): string {
        var results: any = {};
        for (var idx: number = 0; idx < this.entries.length; idx++) {
            hjow_putOnObject(results, this.entries[idx].key, this.entries[idx].value);
        }
        return JSON.stringify(results);
    };
    public fromPlainObject(results: any) {
        var selfObj = this;
        hjow_iterateObject(results, function (propertyName: any, valueOfProperty: any) {
            selfObj.put(String(propertyName), String(valueOfProperty));
        });
    };
    public fromJSON(str: string) {
        var results: Object = JSON.parse(str);
        this.fromPlainObject(results);
    };
};

class TBigInt extends UtilityMethods {
    protected bigIntObj: any = null;
    public constructor(obj: any) {
        super();
        if (obj instanceof TBigInt) {
            this.bigIntObj = hjow_bigint(obj.bigIntObj);
        } else {
            this.bigIntObj = hjow_bigint(obj);
        }
    }
    public add(otherObj: TBigInt): TBigInt {
        return new TBigInt(hjow_bigint_add(this.bigIntObj, otherObj.bigIntObj));
    }
    public subtract(otherObj: TBigInt): TBigInt {
        return new TBigInt(hjow_bigint_subtract(this.bigIntObj, otherObj.bigIntObj));
    }
    public multiply(otherObj: TBigInt): TBigInt {
        return new TBigInt(hjow_bigint_multiply(this.bigIntObj, otherObj.bigIntObj));
    }
    public compare(otherObj: TBigInt): number {
        return hjow_bigint_compare(this.bigIntObj, otherObj.bigIntObj);
    }
    public divide(otherObj: TBigInt) {
        return new TBigInt(hjow_bigint_divide(this.bigIntObj, otherObj.bigIntObj));
    }
    public abs() {
        return new TBigInt(hjow_bigint_abs(this.bigIntObj));
    }
    public getNativeObject(): any {
        return this.bigIntObj;
    }
    public toString(): string {
        return this.bigIntObj.toString();
    }
}

class XCalcReplayAction extends UtilityMethods {
    public date: Date = null;
    public actionPlayerIndex: number = 0;
    public payTargetPlayerIndex: number = -1; // -1 : get one card from deck
    public card: XCalc = null; // pay target
    public toPlainObject(): any {
        return {
            date: hjow_date_to_string(this.date),
            actionPlayerIndex: this.actionPlayerIndex,
            payTargetPlayerIndex: this.payTargetPlayerIndex,
            card: this.card
        };
    }
    public toPlainObjectDetail(engine: XCalcGameEngine): any {
        if (engine == null) return null;
        if (!(engine instanceof XCalcGameEngine)) return null;
        var results = this.toPlainObject();
        if(this.card != null) results.card = this.card.toPlainObjectDetail(engine);
        return results;
    }
};

class XCalcReplay extends UtilityMethods {
    public date: Date = new Date();
    public actions: XCalcReplayAction[] = [];
    public players: XCalcPlayer[] = []; // should be first states
    public deck: XCalc[] = []; // should be first states
    public gameMode: string = null;
    public reason: string = null;
    public debugModeUsed: boolean = false;
    public toPlainObjectDetail(engine: XCalcGameEngine): any {
        if (engine == null) return null;
        if (!(engine instanceof XCalcGameEngine)) return null;

        var actionPlains: any = [];
        for (var adx = 0; adx < this.actions.length; adx++) {
            actionPlains.push(this.actions[adx].toPlainObjectDetail(engine));
        }

        var playersPlains: any = [];
        for (var pdx = 0; pdx < this.players.length; pdx++) {
            playersPlains.push(this.players[pdx].toPlainObject(engine));
        }

        var deckPlains: any = [];
        for (var ddx = 0; ddx < this.deck.length; ddx++) {
            deckPlains.push(this.deck[ddx].toPlainObjectDetail(engine));
        }

        return {
            date: hjow_date_to_string(this.date),
            actions: actionPlains,
            players: playersPlains,
            deck: deckPlains,
            gameMode: this.gameMode,
            reason: this.reason,
            debugModeUsed: this.debugModeUsed
        };
    };
};

class XCalcAIProcessAction extends XCalcReplayAction {
    public calculatedAIPoint: TBigInt = null;
}

class LanguageSet extends UtilityMethods {
    public locale: string = null; // ko, en, ...
    public localeAlt: string = null; // ko-KR, en-US, ...
    public localeName: string = null;
    public stringTable: Properties = null;
    public translate(target: string): string {
        var results: string = this.stringTable.get(target);
        if (results == null) {
            if (this.localeAlt != 'en-US' && this.locale != 'en') hjow_log(target);
            return target;
        }   
        return results;
    };
    public getImgPath(): string {
        return './img/' + this.locale + '/';
    }
};
var hjow_languageSets: LanguageSet[] = [];
var hjow_selectedLocale: string = null;
var hjow_langSelectFirst: boolean = true;
function hjow_getCurrentLanguageSet(): LanguageSet {
    var browserLocale = hjow_getLocaleInfo();
    
    if (hjow_selectedLocale != null) {
        for (var ldx = 0; ldx < hjow_languageSets.length; ldx++) {
            if (hjow_selectedLocale == hjow_languageSets[ldx].locale || hjow_selectedLocale == hjow_languageSets[ldx].localeAlt) {
                return hjow_languageSets[ldx];
            }
        }
    }

    if (typeof (browserLocale) == 'undefined' || browserLocale == null) return null;

    var currentLocale: any[] = hjow_makeArrayCompatible(browserLocale);
    if (currentLocale == null || currentLocale.length <= 0) return null;
    for (var idx = 0; idx < currentLocale.length; idx++) {
        for (var ldx = 0; ldx < hjow_languageSets.length; ldx++) {
            if (currentLocale[idx] == hjow_languageSets[ldx].locale || currentLocale[idx] == hjow_languageSets[ldx].localeAlt) {
                hjow_selectedLocale = hjow_languageSets[ldx].locale;
                return hjow_languageSets[ldx];
            }
        }
    }

    if (hjow_langSelectFirst) {
        hjow_selectedLocale = "en";
        hjow_langSelectFirst = false; // 혹시나 모를 무한반복 방지
        return hjow_getCurrentLanguageSet();
    }
    
    return null;
};
function hjow_trans(target: string): string {
    var langSet: LanguageSet = hjow_getCurrentLanguageSet();
    if (langSet == null) {
        hjow_log(target);
        return target;
    }
    return langSet.translate(target);
};

class ModuleObject extends Uniqueable {
    protected name: string = "";
    protected desc: string = "";
    protected startDate: Date = null;
    protected properties: Properties = null;
    public constructor(name: string, desc: string) {
        super();
        this.name = name;
        this.desc = desc;
        this.startDate = new Date();
        this.properties = new Properties();
    };
    public getClassName(): string {
        return "ModuleObject";
    };
    public getName(): string {
        return this.name;
    };
    public getDescription(): string {
        return this.desc;
    };
    public detail(htmlForm: boolean): string {
        var results: string = this.name + "\n\n" + this.desc + "\n\n" + this.startDate;
        if (htmlForm) results = hjow_htmlForm(results);
        return results;
    };
    public setProperty(key: string, value: string) {
        this.properties.put(key, value);
    };
    public getProperty(key: string): string {
        return this.properties.get(key);
    };
    public clearProperties() {
        this.properties.clear();
    };
    public propertyKeys(): string[] {
        return this.properties.keyList();
    };
};

class IntervalTimer extends ModuleObject {
    private timerRef: number = 0;
    private alives: boolean = false;
    public constructor(name: string, desc: string, func: Function, timeGap: number = 1000) {
        super(name, desc);
        this.timerRef = setInterval(func, timeGap);
        this.alives = true;
    };
    public getClassName(): string {
        return "IntervalTimer";
    };
    public isAlive(): boolean {
        return this.alives;
    };
    public stop() {
        clearInterval(this.timerRef);
        this.alives = false;
    };
};

class ImportantTimer extends IntervalTimer {
    public constructor(name: string, desc: string, func: Function, timeGap: number = 1000) {
        super(name, desc, func, timeGap);
    }
    public getClassName(): string {
        return "ImportantTimer";
    };
};

class XCalc extends Uniqueable {
    public no: number = 0;
    public op: string = '';
    public apply(beforeVal: TBigInt): TBigInt {
        if (this.op == '+' || this.op == '＋') return new TBigInt(beforeVal).add(new TBigInt(this.no));
        if (this.op == '-' || this.op == '－') return new TBigInt(beforeVal).subtract(new TBigInt(this.no));
        if (this.op == '*' || this.op == '×') return new TBigInt(beforeVal).multiply(new TBigInt(this.no));

        // if (this.op == '+' || this.op == '＋') return beforeVal + this.no;
        // if (this.op == '-' || this.op == '－') return beforeVal - this.no;
        // if (this.op == '*' || this.op == '×') return beforeVal * this.no;

        return beforeVal;
    }
    public clone(): XCalc {
        var newOne:XCalc = new XCalc();
        newOne.no = this.no;
        newOne.op = this.op;
        return newOne;
    }
    public toString(): string {
        var result = this.op + " ";
        if (this.no < 0) result += '(' + this.no + ')';
        else result += this.no + '';
        return result;
    }
    public toPlainObject(): any {
        var result = {
            op: this.op,
            no: this.no,
            toString: function () {
                var resultStr = this.op + " ";
                if (this.no < 0) resultStr += '(' + this.no + ')';
                else resultStr += this.no + '';
                return resultStr;
            }
        };
        return result;
    }
    public toPlainObjectDetail(engine: XCalcGameEngine): any {
        if (engine == null) return;
        if (!(engine instanceof XCalcGameEngine)) return;
        var result = this.toPlainObject();
        result.uniqueId = this.uniqueId;
        return result;
    }
    public setUniqueId(engine: XCalcGameEngine, uniqueId: string) {
        if (engine == null) return;
        if (!(engine instanceof XCalcGameEngine)) return;
        this.uniqueId = uniqueId;
    }
};

class XCalcPlayer extends Uniqueable {
    private name: string = "";
    protected inventory: XCalc[] = [];
    protected applied: XCalc[] = [];

    constructor(name: string) {
        super();
        this.name = name;
    };
    public getClassName(): string {
        return "XCalcPlayer";
    };
    public getName(): string {
        return this.name;
    };
    public setInventory(cardList: XCalc[], engine: XCalcGameEngine) {
        if (engine == null) return;
        if (!(engine instanceof XCalcGameEngine)) return;
        this.inventory = cardList;
    };
    public setApplied(cardList: XCalc[], engine: XCalcGameEngine) {
        if (engine == null) return;
        if (!(engine instanceof XCalcGameEngine)) return;
        this.applied = cardList;
    };
    public lastAppliedCard(): XCalc {
        if (this.applied.length == 0) return null;
        return this.applied[this.applied.length - 1];
    };
    public findInventoryCard(engine: XCalcGameEngine, cardUniqId: string): XCalc {
        if (engine == null) return null;
        if (!(engine instanceof XCalcGameEngine)) return null;
        for (var idx = 0; idx < this.inventory.length; idx++) {
            if (this.inventory[idx].getUniqueId() == cardUniqId) {
                return this.inventory[idx];
            }
        }
        return null;
    };
    public listInventoryDirect(engine: XCalcGameEngine): XCalc[] {
        if (engine == null) return null;
        if (!(engine instanceof XCalcGameEngine)) return null;
        var newList: XCalc[] = [];
        for (var idx = 0; idx < this.inventory.length; idx++) {
            newList.push(this.inventory[idx]);
        }
        return newList;
    };
    public listInventory(): XCalc[] {
        var newList: XCalc[] = [];
        for (var idx = 0; idx < this.inventory.length; idx++) {
            newList.push(this.inventory[idx].clone());
        }
        return newList;
    };
    public listInventoryPlainObject(): any[] {
        var newList: any[] = [];
        for (var idx = 0; idx < this.inventory.length; idx++) {
            newList.push(this.inventory[idx].toPlainObject());
        }
        return newList;
    };
    public listAppliedDirect(engine: XCalcGameEngine): XCalc[] {
        if (engine == null) return null;
        if (!(engine instanceof XCalcGameEngine)) return null;
        var newList: XCalc[] = [];
        for (var idx = 0; idx < this.applied.length; idx++) {
            newList.push(this.applied[idx]);
        }
        return newList;
    };
    public listApplied(): XCalc[] {
        var newList: XCalc[] = [];
        for (var idx = 0; idx < this.applied.length; idx++) {
            newList.push(this.applied[idx].clone());
        }
        return newList;
    };
    public listAppliedPlainObject(): any[] {
        var newList: any[] = [];
        for (var idx = 0; idx < this.applied.length; idx++) {
            newList.push(this.applied[idx].toPlainObject());
        }
        return newList;
    };
    public listAppliedAsString(): string {
        var affects: string = "0";
        var lastOp: string = "+";
        for (var idx = 0; idx < this.applied.length; idx++) {
            var cardOne: XCalc = this.applied[idx];
            var needSealBlacket: boolean = false;

            if (lastOp == '+' || lastOp == '＋' || lastOp == '-' || lastOp == '－') {
                if (!(cardOne.op == '+' || cardOne.op == '＋' || cardOne.op == '-' || cardOne.op == '－')) {
                    needSealBlacket = true;
                }
            } else {
                if (cardOne.op == '+' || cardOne.op == '＋' || cardOne.op == '-' || cardOne.op == '－') {
                    needSealBlacket = true;
                }
            }

            if (needSealBlacket) affects = "(" + affects + ")";

            affects += " " + cardOne.op + " ";
            if (cardOne.no < 0) affects += " (" + cardOne.no + ")";
            else affects += " " + cardOne.no;
            
            lastOp = cardOne.op;
        }
        return affects;
    };
    private removeCardOnInventory(card: XCalc) {
        var ownerInvIdx = 0;
        for (var idx = 0; idx < this.inventory.length; idx++) {
            if (this.inventory[idx].getUniqueId() == card.getUniqueId()) {
                ownerInvIdx = idx;
                break;
            }
        }
        hjow_removeItemFromArray(this.inventory, ownerInvIdx);
    };
    public addOneOnInventory(card: XCalc, engine: XCalcGameEngine) { // 인벤토리에 카드 하나 추가 (덱에서 추가할 때 보통 사용)
        if (engine == null) return;
        if (!(engine instanceof XCalcGameEngine)) return;
        this.inventory.push(card);
    };
    public getInventoryCardCount(): number {
        return this.inventory.length;
    };
    public resetCards() {
        this.inventory = [];
        this.applied = [];
    };
    public canPay(card: XCalc, owner: XCalcPlayer): string { // 본인/상대방이 이 플레이어의 슬롯에 카드를 두기 전 가능여부 확인, null 리턴이면 카드 두기가 가능, 뭔가 문자열이 리턴이 되면 해당 이유로 인해 카드 두기가 불가능한 것
        var lastCard: XCalc = this.lastAppliedCard();
        if (card == null || owner == null) return hjow_trans("Please select your card first.");
        if (lastCard == null) return null; // 카드가 아직 아무것도 놓인 게 없으면 무조건 허용
        if (lastCard.no == 7 && owner.getUniqueId() != this.getUniqueId()) {
            return hjow_trans("7-Protected slot. Only the owner can pay here now.");
        }
        if (card.no == 1) return null;
        if (lastCard.no == card.no) return null;
        if (lastCard.op == card.op) return null;

        return hjow_replaceStr(hjow_trans("The number, or the operation symbol should equal to the card [[LASTCARD]]"), "[[LASTCARD]]", lastCard.toString());
    };
    public canPayByUniqId(cardUniqId: string, owner: XCalcPlayer): string {
        var card: XCalc = null;
        if (cardUniqId == null) return hjow_trans("Please select your card first.");
        for (var idx = 0; idx < owner.inventory.length; idx++) {
            if (owner.inventory[idx].getUniqueId() == cardUniqId) {
                card = owner.inventory[idx];
            }
        }
        return this.canPay(card, owner);
    };
    public pay(card: XCalc, owner: XCalcPlayer): string { // 본인/상대방이 이 플레이어의 슬롯에 카드를 둘 때 사용, null 리턴이면 카드 두기가 성공(처리됨), 뭔가 문자열이 리턴이 되면 해당 이유로 인해 카드 두기가 불가능(처리 안됨)
        var lastCard: XCalc = this.lastAppliedCard();
        var err: string = this.canPay(card, owner);
        if (err != null) return err;

        this.applied.push(card);
        owner.removeCardOnInventory(card);

        return null;
    };
    public payByUniqId(cardUniqId: string, owner: XCalcPlayer): string {
        var card: XCalc = null;
        if (cardUniqId == null) return hjow_trans("Please select your card first.");
        for (var idx = 0; idx < owner.inventory.length; idx++) {
            if (owner.inventory[idx].getUniqueId() == cardUniqId) {
                card = owner.inventory[idx];
            }
        }
        return this.pay(card, owner);
    };
    
    public getCurrentPoint(gameMode: XCalcGameMode): TBigInt {
        var results: TBigInt = new TBigInt(0);
        for (var idx = 0; idx < this.applied.length; idx++) {
            var cardOne = this.applied[idx];
            results = cardOne.apply(results);
        }

        return gameMode.processPoint(this, results);
    };
    public getCurrentPointIfPaid(gameMode: XCalcGameMode, additionalCard: XCalc): TBigInt {
        var results: TBigInt = new TBigInt(0);
        var simulatedApplied: XCalc[] = [];
        for (var idx = 0; idx < this.applied.length; idx++) {
            simulatedApplied.push(this.applied[idx]);
        }
        simulatedApplied.push(additionalCard);
        for (var idx = 0; idx < simulatedApplied.length; idx++) {
            var cardOne = simulatedApplied[idx];
            results = cardOne.apply(results);
        }

        return gameMode.processPoint(this, results);
    };
    public customMainHTML(): string {
        return null;
    };
    public customGameHTML(): string {
        return null;
    };
    public applyInputs(engine: XCalcGameEngine, gameStarted: boolean, needHideScreen: boolean, showResult: boolean) {

    };
    public refreshMain(engine: XCalcGameEngine) {

    };
    public refreshGame(engine: XCalcGameEngine) {

    };
    public getPlayerTypeName(): string {
        return null;
    };
    public isUserControllable(): boolean { // 사용자가 컨트롤 가능
        return true;
    };
    public needToHideInventoryForSelf(): boolean { // AI가 아닌 경우, 자기 자신 차례일 때는 인벤토리가 보여야 함
        return false;
    };
    public actOnTurn(engine: XCalcGameEngine, mode: XCalcGameMode, deck: XCalc[], players: XCalcPlayer[], turnNumber: number) {
        if (engine == null) return;
        if (!(engine instanceof XCalcGameEngine)) return;

    };
    public setName(name: string, engine: XCalcGameEngine) {
        if (engine == null) return;
        if (!(engine instanceof XCalcGameEngine)) return;
        if (! this.isNameEditable()) return;
        this.name = name;
    };
    public isNameEditable(): boolean {
        return true;
    };
    protected setUniqueId(uniqueId: string) {
        this.uniqueId = uniqueId;
    };
    public setUniqueIdFromMode(mode: XCalcGameMode, uniqueId: string) {
        if (mode == null) return;
        if (!(mode instanceof XCalcGameMode)) return;
        this.uniqueId = uniqueId;
    };
    public toPlainObject(engine: XCalcGameEngine): any {
        if (engine == null) return;
        if (!(engine instanceof XCalcGameEngine)) return;

        var invArr: any[] = [];
        for (var idx = 0; idx < this.inventory.length; idx++) {
            invArr.push(this.inventory[idx].toPlainObjectDetail(engine));
        }
        var appArr: any[] = [];
        for (var adx = 0; adx < this.applied.length; adx++) {
            appArr.push(this.applied[adx].toPlainObjectDetail(engine));
        }

        return {
            type: "Undefined",
            name: this.name,
            inventory: invArr,
            applied: appArr,
            uniqueId: this.getUniqueId()
        };
    };
};

class XCalcPlayerCreator extends Uniqueable {
    public getTypeName() {
        return null;
    };
    public getSupportPlayerClassName() {
        return null;
    };
    public create(name: string): XCalcPlayer {
        return null;
    };
    public restoreFromPlainObject(obj: any, engine: XCalcGameEngine): XCalcPlayer {
        return null;
    };
    public restoreFromJSON(json: string, engine: XCalcGameEngine): XCalcPlayer {
        if (engine == null) return null;
        if (!(engine instanceof XCalcGameEngine)) return null;
        return this.restoreFromPlainObject(JSON.parse(json), engine);
    };
    public isUserSelect(): boolean { // false 시 플레이어 종류 목록에 보이지 않음
        return true;
    };
};

class XCalcUserPlayer extends XCalcPlayer {
    public constructor(name: string) {
        super(name);
    };
    public getClassName(): string {
        return "XCalcUserPlayer";
    };
    public getPlayerTypeName(): string {
        return "Player";
    };
    public toPlainObject(engine: XCalcGameEngine): any {
        if (engine == null) return null;
        if (!(engine instanceof XCalcGameEngine)) return null;

        var result = super.toPlainObject(engine);
        result.type = this.getClassName();
        return result;
    };
    public setUniqueIdFromCreator(creator: XCalcPlayerCreator, uniqueId: string) {
        if (creator == null) return;
        if (!(creator instanceof XCalcUserPlayerCreator)) return;
        this.setUniqueId(uniqueId);
    };
};

class XCalcUserPlayerCreator extends XCalcPlayerCreator {
    public getTypeName() {
        return "Player";
    };
    public create(name: string): XCalcPlayer {
        return new XCalcUserPlayer(name);
    };
    public getSupportPlayerClassName() {
        return "XCalcUserPlayer";
    };
    public restoreFromPlainObject(obj: any, engine: XCalcGameEngine): XCalcPlayer {
        if (engine == null) return null;
        if (!(engine instanceof XCalcGameEngine)) return null;
        if (obj.type != this.getSupportPlayerClassName()) return null;
        var result: XCalcUserPlayer = new XCalcUserPlayer(obj.name);
        result.setUniqueIdFromCreator(this, obj.uniqueId);
        var invArr: XCalc[] = [];
        for (var idx = 0; idx < obj.inventory.length; idx++) {
            var newCard: XCalc = new XCalc();
            newCard.no = obj.inventory[idx].no;
            newCard.op = obj.inventory[idx].op;
            newCard.setUniqueId(engine, obj.inventory[idx].uniqueId);
            invArr.push(newCard);
        }
        result.setInventory(invArr, engine);
        var appArr: XCalc[] = [];
        for (var adx = 0; adx < obj.applied.length; adx++) {
            var newCard: XCalc = new XCalc();
            newCard.no = obj.applied[adx].no;
            newCard.op = obj.applied[adx].op;
            newCard.setUniqueId(engine, obj.applied[adx].uniqueId);
            appArr.push(newCard);
        }
        result.setApplied(appArr, engine);
        return result;
    };
};

function hjow_orderPlayerList(players: XCalcPlayer[], gameMode: XCalcGameMode): XCalcPlayer[] {
    var playerOrders: XCalcPlayer[] = [];
    var temps: XCalcPlayer[] = hjow_simpleCloneArray(players);

    // 순위별로 플레이어 다시 정렬
    var preventInfLoop: number = 0;
    while (temps.length > 0) {
        var maxVal: string = null;
        var maxIdx: number = -1;
        if (temps.length == 1) {
            playerOrders.push(temps[0]);
            temps = [];
            break;
        } else {
            for (var tdx2 = 0; tdx2 < temps.length; tdx2++) {
                var points = temps[tdx2].getCurrentPoint(gameMode);
                if (maxVal == null || new TBigInt(maxVal).compare(points) < 0) {
                    maxVal = String(points);
                    maxIdx = tdx2;
                }
            }
        }
        playerOrders.push(temps[maxIdx]);
        hjow_removeItemFromArray(temps, maxIdx);

        preventInfLoop++;
        if (preventInfLoop >= 1000 * Math.max(temps.length, 1)) {
            hjow_error("Infinite Loop Detected");
            break;
        }
    }

    return playerOrders;
};

class XCalcAIPlayer extends XCalcPlayer {
    protected difficulty: number = 0;
    protected customAIScript: string = null;
    public constructor(name: string) {
        super(name);
    };
    public getClassName(): string {
        return "XCalcAIPlayer";
    };
    public getPlayerTypeName(): string {
        return "AI";
    };
    public isUserControllable(): boolean { // 사용자가 컨트롤 불가능
        return false;
    };
    public needToHideInventoryForSelf(): boolean { // AI인 경우, 자기 자신 차례일 때도 인벤토리가 보이면 안 됨
        return true;
    };
    public setDifficulty(diff: number, engine: XCalcGameEngine) {
        if (engine == null) return;
        if (!(engine instanceof XCalcGameEngine)) return;
        this.difficulty = diff;
    };
    public setCustomAIScript(scripts: string, engine: XCalcGameEngine) {
        if (engine == null) return;
        if (!(engine instanceof XCalcGameEngine)) return;
        this.customAIScript = scripts;
    };
    public actOnTurn(engine: XCalcGameEngine, mode: XCalcGameMode, deck: XCalc[], players: XCalcPlayer[], turnNumber: number) {
        if (engine == null) return;
        if (!(engine instanceof XCalcGameEngine)) return;
        if (engine.isActPlayerStopRequested() || (!engine.isThisTurn(this))) return;

        // 플레이어에게 주어지는 시간 (남은 시간과 1초정도 다를 수 있음)
        var currentPlayerTime: number = mode.getEachPlayerTimeLimit(this, engine);
        var timeLimitStd: number = Math.ceil(currentPlayerTime / 5.0);
        if (timeLimitStd <= 2) timeLimitStd = 2;

        /////// AI 인공지능 처리 시작 ///////
        // 결과 변수 준비
        var needToGetFromDeck: boolean = true;
        var targetPlayerUniqId: string = null;
        var targetCardUniqId: string = null;

        // 최적의 수 계산
        var needDefaultCalc = true;

        /***********************************************
        // customAIScript 안에 들어갈 문자열 내용 샘플
        var aiProcessFunction = function(engine, deck, players, currentPlayerTime) { // deck 은 덱에 있는 카드 객체들의 배열, players 는 플레이어 객체들의 배열 (객체 안에서 필요한 데이터와 고유값에 액세스하면 됨), currentPlayerTime 는 플레이어의 제한 시간
            var getDeck = true;              // 덱에서 카드를 받아야 할 때 true 지정 (다른 플레이어에게 카드를 놓아야 할 때는 반드시 false 로 지정할 것)
            var targetPlayerUniqueId = null; // 카드를 다른 플레이어에게 놓아야 할 때, 대상 플레이어의 고유값 지정
            var targetCardUniqueId   = null; // 카드를 다른 플레이어에게 놓아야 할 때, 대상 카드의 고유값 지정

            // 이 곳에서 연산 작업 수행
            
            return {
                needToGetFromDeck: getDeck         // needToGetFromDeck 이름은 반드시 지켜야 호환됨
              , targetPlayer: targetPlayerUniqueId // targetPlayer 이름은 반드시 지켜야 호환됨
              , targetCard: targetCardUniqueId     // targetCard 이름은 반드시 지켜야 호환됨
            };
        };
        var returnObject = {
            aiProcess: aiProcessFunction // aiProcess 이름은 반드시 지켜야 호환됨
        };
        // eval 처리 결과로 리턴 처리를 위해 만들어둔 변수명을 적어 마무리
        returnObject
        ***********************************************/
        if (this.customAIScript != null && this.customAIScript != '') { // 커스텀 AI 스크립트 여부 확인해 처리
            var resultObj: any = eval(this.customAIScript);
            if (resultObj == null || typeof (resultObj) == 'undefined') {
                needDefaultCalc = true;
            } else if (resultObj.aiProcess == null || typeof (resultObj.aiProcess) == 'undefined') {
                needDefaultCalc = true;
            } else {
                resultObj = resultObj.aiProcess(engine, deck, players, currentPlayerTime);
                needToGetFromDeck = hjow_parseBoolean(resultObj.needToGetFromDeck);
                targetPlayerUniqId = String(resultObj.targetPlayer);
                targetCardUniqId = String(resultObj.targetCard);

                needDefaultCalc = false;
            }
        }

        if (engine.isActPlayerStopRequested() || (!engine.isThisTurn(this))) return; // 시간 제한이 지났는지 확인 (지났으면 연산 중단)

        if (needDefaultCalc) { // 기본 제공 인공지능 처리 로직
            // 사용 가능한 동작들을 다 배열에 넣어서 각각 수행 결과 이득 정도를 점수를 매겨 그중 높은 점수를 선택하도록 함 (난이도가 낮으면 랜덤하게 일정 확률로 덜 높은 점수의 동작을 선택하면 됨)
            var availableActions: XCalcAIProcessAction[] = [];
            var oneAct: XCalcAIProcessAction = null;

            var offensives: number = 1; // 공격 행동 비율점수
            var defendees: number = 1;  // 방어 행동 비율점수

            // 난이도에 따라 인공지능을 좀 더 방어적으로 행동하도록 함
            if (this.difficulty == 2) defendees = 2;
            if (this.difficulty == 1) defendees = 4;
            if (this.difficulty == 0) defendees = 8;

            // 덱에서 카드를 받는 동작은 항상 사용가능 (단, 지금 다른 플레이어에 비해 불리한 상황이면서 덱에 남은 카드 수가 적으면, 점수를 낮게 책정함) --> 동작 수는 항상 1 이상
            oneAct = new XCalcAIProcessAction();
            oneAct.card = null;
            oneAct.payTargetPlayerIndex = -1; // 덱에서 카드 받을 때는 -1
            oneAct.actionPlayerIndex = 0;
            oneAct.calculatedAIPoint = new TBigInt(0);
            var currentThisUserPoint = this.getCurrentPoint(mode);
            if (deck.length < Math.ceil(players.length / 2.0)) { // 덱에 있는 카드 수가 매우 적으면 (플레이어 많으면 기준치를 적정량 늘려야 함)
                for (var idx = 0; idx < players.length; idx++) {
                    if (players[idx].getUniqueId() == this.getUniqueId()) continue;
                    if (players[idx].getCurrentPoint(mode).compare(currentThisUserPoint) > 0) { // 다른 플레이어가 지금 이 플레이어보다 점수가 높음
                        oneAct.calculatedAIPoint = oneAct.calculatedAIPoint.subtract(players[idx].getCurrentPoint(mode).subtract(currentThisUserPoint)); // 다른 플레이어와 이 플레이어의 점수 차만큼 점수 제거
                    }
                    if (players[idx].getCurrentPoint(mode).compare(currentThisUserPoint) == 0) { // 다른 플레이어가 지금 이 플레이어와 점수가 동일
                        oneAct.calculatedAIPoint = oneAct.calculatedAIPoint.subtract(new TBigInt(1)); // 1점
                    }
                }
            }
            oneAct.calculatedAIPoint = oneAct.calculatedAIPoint.subtract(new TBigInt(offensives)); // 공격 행동 비율점수만큼 뺄셈
            availableActions.push(oneAct);

            if (engine.isActPlayerStopRequested() || (!engine.isThisTurn(this))) return; // 시간 제한이 지났는지 확인 (지났으면 연산 중단)

            var playerOrders = hjow_orderPlayerList(players, mode); // 점수 순위로 플레이어 순서 정렬한 배열 미리 준비 (점수가 너무 낮은 플레이어에게 공격하는 것을 방지하기 위함)
            var sumPoint: TBigInt = new TBigInt(0); // 전체 플레이어의 점수도 계산할 예정
            var selfOrder: number = -1; // 자기자신의 순위 계산
            for (var podx = 0; podx < playerOrders.length; podx++) {
                if (playerOrders[podx].getUniqueId() == this.getUniqueId()) {
                    selfOrder = podx;
                }
                sumPoint = sumPoint.add(playerOrders[podx].getCurrentPoint(mode));
            }

            var avgPoint: TBigInt = sumPoint.divide(new TBigInt(players.length)); // 평균 점수
            var bestPoint: TBigInt = playerOrders[0].getCurrentPoint(mode); // 1등의 현 점수
            var worstPoint: TBigInt = playerOrders[playerOrders.length - 1].getCurrentPoint(mode); // 꼴찌의 점수
            var variancePoint: TBigInt = bestPoint.subtract(worstPoint); // 1등과 꼴찌 점수 차이

            // 다른 플레이어에게 카드를 줄 수 있는 모든 경우의 수 찾기
            for (var cdx = 0; cdx < this.inventory.length; cdx++) {
                var invCard: XCalc = this.inventory[cdx];
                for (var pdx = 0; pdx < players.length; pdx++) {
                    var playerOne: XCalcPlayer = players[pdx];
                    var errMsg: string = playerOne.canPay(invCard, this);
                    if (errMsg != null) continue; // 카드 내기가 불가능 - 사용 가능 동작에 등록하지 않음

                    // 사용 가능 동작임이 확인됨, 동작 점수 계산

                    var playerOneOrder: number = -1; // 이 대상 플레이어의 순위 계산
                    for (var podx2 = 0; podx2 < playerOrders.length; podx2++) {
                        if (playerOrders[podx2].getUniqueId() == playerOne.getUniqueId()) {
                            playerOneOrder = podx2;
                            break;
                        }
                    }

                    var actionPoint: TBigInt = null;
                    var beforePoint: TBigInt = playerOne.getCurrentPoint(mode); // 이 대상 플레이어의 변화 전 점수
                    var simulatedPoint: TBigInt = playerOne.getCurrentPointIfPaid(mode, invCard); // 이 대상 플레이어의 변화결과 점수
                    
                    if (playerOne.getUniqueId() == this.getUniqueId()) {
                        actionPoint = simulatedPoint.multiply(new TBigInt(defendees)); // 자기자신에게 카드를 놓음 - 방어 비율 적용
                    } else {
                        actionPoint = simulatedPoint.multiply(new TBigInt(-1)).multiply(new TBigInt(offensives)); // 상대방에게 카드를 놓음 - 공격 비율 적용

                        // 상대방 플레이어의 순위가 자신 대비 너무 낮은 경우 더 공격할 필요가 줄어듦 - 공격 확률 축소
                        if (beforePoint.compare(simulatedPoint) > 0) { // 카드를 두면 상대의 점수가 더 적어지는 경우에만 이 기능 적용 (공격이 아닌, 어쩔 수 없이 손해를 보더라도 두는 경우는 이 기능 적용 안 하기 위함)
                            var orderStd: number = Math.ceil(players.length / 2.0); // 순위 차이가 어느정도 나야 많이 나는 것으로 인식해야 할 지를 적당히 계산함
                            if (selfOrder < playerOneOrder && Math.abs(playerOneOrder - selfOrder) >= orderStd) { // 순위는 숫자가 낮을수록 좋음!! 위에서 계산한 기준치 적용

                                // bigInt 는 정수만 지원하므로 나눗셈을 하면 나머지 부분이 날아감 (소수점 내림), 그러므로, 먼저 2배를 하고 나눗셈을 한 후 2를 다시 나누면 반올림 효과 비슷하게 동작함
                                actionPoint = actionPoint.multiply(new TBigInt(2));
                                actionPoint = actionPoint.divide(new TBigInt(Math.round(Math.abs(playerOneOrder - selfOrder))).multiply(new TBigInt(10))); // 순위 차이 만큼 나눔, 순위 차이가 클 수록 나누는 수가 커짐
                                actionPoint = actionPoint.divide(new TBigInt(2));

                                // 점수 차가 너무 벌어져 있다면 이것으로도 부족하므로 추가 작업
                                if (avgPoint.compare(beforePoint) > 0) {
                                    var targetPlayerGapAvg: TBigInt = avgPoint.subtract(beforePoint); // 평균 점수에서 타겟 플레이어 점수를 뺌
                                    if (targetPlayerGapAvg.abs().compare(variancePoint.abs().divide(new TBigInt(4))) > 0) {
                                        actionPoint = actionPoint.subtract(new TBigInt(-999999999));
                                    }
                                }
                            }
                        }
                    }
                    // 이 시점에서 actionPoint 는 null 이 아님
                    for (var pdx2 = 0; pdx2 < players.length; pdx2++) {
                        var playerAnother: XCalcPlayer = players[pdx2];
                        if (playerAnother.getUniqueId() == playerOne.getUniqueId()) continue; // 이미 계산한 플레이어는 점수 계산에서 제외

                        if (playerAnother.getUniqueId() == this.getUniqueId()) {
                            actionPoint = actionPoint.add(playerAnother.getCurrentPoint(mode));
                        } else {
                            actionPoint = actionPoint.subtract(playerAnother.getCurrentPoint(mode));
                        }
                    }

                    oneAct = new XCalcAIProcessAction();
                    oneAct.card = invCard;
                    oneAct.payTargetPlayerIndex = pdx;
                    oneAct.actionPlayerIndex = 0;
                    for (var pdx3 = 0; pdx3 < players.length; pdx3++) { // 자기자신의 인덱스를 알아내기 위함
                        if (players[pdx3].getUniqueId() == this.getUniqueId()) {
                            oneAct.actionPlayerIndex = pdx3;
                            break;
                        }
                    }
                    oneAct.calculatedAIPoint = actionPoint;
                    availableActions.push(oneAct); // 동작에 추가

                    if (engine.isActPlayerStopRequested() || (!engine.isThisTurn(this))) return; // 시간 제한이 지났는지 확인 (지났으면 연산 중단)
                    if (engine.getLeftTime() < timeLimitStd) break; // 시간 제한이 지나지는 않았으나 얼마 안남았으면 반복처리 중단, 지금까지의 연산 결과만 반영
                }
                if (engine.isActPlayerStopRequested() || (!engine.isThisTurn(this))) return; // 시간 제한이 지났는지 확인 (지났으면 연산 중단)
                if (engine.getLeftTime() < timeLimitStd) break; // 시간 제한이 지나지는 않았으나 얼마 안남았으면 반복처리 중단, 지금까지의 연산 결과만 반영
            }

            // 동작들을 가지고 순서 매기기
            var orderedActions: XCalcAIProcessAction[] = [];
            var maxPoints: TBigInt = new TBigInt("-99999999999999");
            var maxIdx: number = -1;
            var preventInfLoop: number = 0;
            while (availableActions.length >= 1) {
                if (availableActions.length == 1) {
                    orderedActions.push(availableActions[0]);
                    break;
                } else {
                    maxPoints = new TBigInt("-99999999999999");
                    maxIdx = -1;
                    for (var bdx = 0; bdx < availableActions.length; bdx++) {
                        var currentAction = availableActions[bdx];
                        if (maxPoints.compare(currentAction.calculatedAIPoint) < 0) {
                            maxPoints = currentAction.calculatedAIPoint;
                            maxIdx = bdx;
                        }
                    }
                    orderedActions.push(availableActions[maxIdx]);
                    hjow_removeItemFromArray(availableActions, maxIdx);
                }

                if (engine.isActPlayerStopRequested() || (!engine.isThisTurn(this))) return; // 시간 제한이 지났는지 확인 (지났으면 연산 중단)

                preventInfLoop++;
                if (preventInfLoop >= 1000 * Math.max(availableActions.length, 1)) {
                    hjow_error("Infinite Loop Detected");
                    break;
                }
            }

            if (engine.isActPlayerStopRequested() || (!engine.isThisTurn(this))) return; // 시간 제한이 지났는지 확인 (지났으면 연산 중단)

            // 동작들 중 실제 수행할 동작 선택
            var selectedAct: XCalcAIProcessAction = null;
            var randomNo: number = Math.round(Math.random() * 100.0);
            if (this.difficulty >= 4) { // 미친 난이도
                selectedAct = orderedActions[0]; // 그냥 가장 좋은 선택을 함
            } else if (this.difficulty == 3) { // 극한
                if (randomNo >= 10) selectedAct = orderedActions[0]; // 그냥 가장 좋은 선택을 함
                else if (orderedActions.length >= 2) selectedAct = orderedActions[1]; // 차선
                else selectedAct = orderedActions[0]; // 그냥 가장 좋은 선택을 함
            } else if (this.difficulty == 2) { // 어려움
                if (randomNo >= 50) selectedAct = orderedActions[0]; // 그냥 가장 좋은 선택을 함
                else if (randomNo >= 10 && orderedActions.length >= 2) selectedAct = orderedActions[1]; // 차선
                else if (orderedActions.length >= 3) selectedAct = orderedActions[2]; // 차차선
                else selectedAct = orderedActions[0]; // 그냥 가장 좋은 선택을 함
            } else if (this.difficulty == 1) { // 보통
                if (randomNo >= 65) selectedAct = orderedActions[0]; // 그냥 가장 좋은 선택을 함
                else if (randomNo >= 30 && orderedActions.length >= 2) selectedAct = orderedActions[1]; // 차선
                else if (randomNo >= 10 && orderedActions.length >= 3) selectedAct = orderedActions[2]; // 차차선
                else if (randomNo >= 5  && orderedActions.length >= 4) selectedAct = orderedActions[3]; // 차차차선
                else selectedAct = orderedActions[0]; // 그냥 가장 좋은 선택을 함
            } else { // 쉬움
                if (randomNo >= 70) selectedAct = orderedActions[0]; // 그냥 가장 좋은 선택을 함
                else if (randomNo >= 60 && orderedActions.length >= 2) selectedAct = orderedActions[1]; // 차선
                else if (randomNo >= 50 && orderedActions.length >= 3) selectedAct = orderedActions[2]; // 차차선
                else if (randomNo >= 20 && orderedActions.length >= 4) selectedAct = orderedActions[3]; // 차차차선
                else if (randomNo >= 5  && orderedActions.length >= 5) selectedAct = orderedActions[4]; // 차차차차선
                else selectedAct = orderedActions[0]; // 그냥 가장 좋은 선택을 함
            }

            // 동작 처리
            if (selectedAct == null || selectedAct.payTargetPlayerIndex < 0) {
                needToGetFromDeck = true;
            } else {
                needToGetFromDeck = false;
                targetPlayerUniqId = players[selectedAct.payTargetPlayerIndex].getUniqueId();
                targetCardUniqId = selectedAct.card.getUniqueId();
            }
        }

        if (engine.isActPlayerStopRequested() || (!engine.isThisTurn(this))) return; // 시간 제한이 지났는지 확인 (지났으면 연산 중단)

        // 계산 결과 집행
        if (needToGetFromDeck || targetPlayerUniqId == null || targetCardUniqId == null || targetPlayerUniqId == '' || targetCardUniqId == '') {
            engine.getSelfObject().events.game.btn_get_from_deck();
            return;
        }
        var errMsg = engine.payHere(targetPlayerUniqId, targetCardUniqId);
        if (errMsg != null) {
            engine.getSelfObject().events.game.btn_get_from_deck();
            return;
        }
        
    };
    public customMainHTML(): string {
        var results: string = "";
        results += "<div class='div_player_ai_custom'>";
        results += "<div class='div_player_ai_custom_element'>";
        results += "<span class='label'>" + hjow_trans("Difficulty") + "</span> ";
        results += "<select class='sel_ai_difficulty'>";
        for (var idx = 0; idx <= 4; idx++) {
            var difficultyStr: string = "";
            if (idx <= 0) difficultyStr = hjow_trans("Easy");
            if (idx == 1) difficultyStr = hjow_trans("Normal");
            if (idx == 2) difficultyStr = hjow_trans("Hard");
            if (idx == 3) difficultyStr = hjow_trans("Extreme");
            if (idx >= 4) difficultyStr = hjow_trans("Crazy");
            results += "<option value='" + idx + "'>" + hjow_serializeXMLString(difficultyStr) + "</option>";
        }
        results += "</select>";
        results += "</div>";
        results += "<div class='div_player_ai_custom_element wide'>";
        results += "<textarea class='tx_ai_script advanceMode' placeholder=\"" + hjow_serializeString("// " + hjow_trans("paste custom AI script here if you want")) + "\"></textarea>";
        results += "</div>";
        return results;
    };
    public refreshMain(engine: XCalcGameEngine) {
        var playerBlock = jq(engine.getPlaceArea()).find(".pbasic_" + this.getUniqueId());
        var textBlock = playerBlock.find('.tx_ai_script');
        textBlock.val('');
        if (this.customAIScript != null) textBlock.val(this.customAIScript);
    };
    public applyInputs(engine: XCalcGameEngine, gameStarted: boolean, needHideScreen: boolean, showResult: boolean) {
        if (gameStarted) return;
        if (needHideScreen) return;
        if (showResult) return;
        var playerBlock = jq(engine.getPlaceArea()).find(".pbasic_" + this.getUniqueId());
        var diff = playerBlock.find('.sel_ai_difficulty').val();
        this.difficulty = parseInt(diff);

        var scriptInputs = String(playerBlock.find(".tx_ai_script").val());
        scriptInputs = scriptInputs.trim();
        if (scriptInputs != '') {
            this.customAIScript = scriptInputs;
        }
    };
    public toPlainObject(engine: XCalcGameEngine): any {
        if (engine == null) return null;
        if (!(engine instanceof XCalcGameEngine)) return null;

        var result = super.toPlainObject(engine);
        result.type = this.getClassName();
        result.difficulty = this.difficulty;
        result.customAIScript = this.customAIScript;
        return result;
    };
    public setUniqueIdFromCreator(creator: XCalcPlayerCreator, uniqueId: string) {
        if (creator == null) return;
        if (!(creator instanceof XCalcAIPlayerCreator)) return;
        this.setUniqueId(uniqueId);
    };
};

class XCalcAIPlayerCreator extends XCalcPlayerCreator {
    public getTypeName() {
        return "AI";
    };
    public create(name: string): XCalcPlayer {
        return new XCalcAIPlayer(name);
    };
    public getSupportPlayerClassName() {
        return "XCalcAIPlayer";
    };
    public restoreFromPlainObject(obj: any, engine: XCalcGameEngine): XCalcPlayer {
        if (engine == null) return null;
        if (!(engine instanceof XCalcGameEngine)) return null;
        if (obj.type != this.getSupportPlayerClassName()) return null;
        var result: XCalcAIPlayer = new XCalcAIPlayer(obj.name);
        result.setUniqueIdFromCreator(this, obj.uniqueId);
        var invArr: XCalc[] = [];
        for (var idx = 0; idx < obj.inventory.length; idx++) {
            var newCard: XCalc = new XCalc();
            newCard.no = obj.inventory[idx].no;
            newCard.op = obj.inventory[idx].op;
            newCard.setUniqueId(engine, obj.inventory[idx].uniqueId);
            invArr.push(newCard);
        }
        result.setInventory(invArr, engine);
        var appArr: XCalc[] = [];
        for (var adx = 0; adx < obj.applied.length; adx++) {
            var newCard: XCalc = new XCalc();
            newCard.no = obj.applied[adx].no;
            newCard.op = obj.applied[adx].op;
            newCard.setUniqueId(engine, obj.applied[adx].uniqueId);
            appArr.push(newCard);
        }
        result.setApplied(appArr, engine);
        result.setDifficulty(obj.difficulty, engine);
        result.setCustomAIScript(obj.customAIScript, engine);
        return result;
    };
};

class XCalcTutorialPlayer extends XCalcAIPlayer {
    public constructor(name: string) {
        super(name);
        this.difficulty = 9;
    }
    public getPlayerTypeName(): string {
        return "Tutorial Assistant";
    };
    public getClassName() {
        return "XCalcTutorialPlayer";
    };
    public actOnTurn(engine: XCalcGameEngine, mode: XCalcGameMode, deck: XCalc[], players: XCalcPlayer[], turnNumber: number) {
        
    };
    public toPlainObject(engine: XCalcGameEngine): any {
        if (engine == null) return null;
        if (!(engine instanceof XCalcGameEngine)) return null;

        var result = super.toPlainObject(engine);
        result.type = this.getClassName();
        result.difficulty = 0;
        result.customAIScript = '';
        return result;
    };
    public setUniqueIdFromCreator(creator: XCalcPlayerCreator, uniqueId: string) {
        if (creator == null) return;
        if (!(creator instanceof XCalcTutorialPlayerCreator)) return;
        this.setUniqueId(uniqueId);
    };
    public customMainHTML(): string {
        return null;
    };
    public refreshMain(engine: XCalcGameEngine) {
        
    };
    public applyInputs(engine: XCalcGameEngine, gameStarted: boolean, needHideScreen: boolean, showResult: boolean) {
        this.difficulty = 9;
    };
    public isNameEditable() {
        return false;
    };
};

class XCalcTutorialPlayerCreator extends XCalcAIPlayerCreator {
    public getTypeName() {
        return "Tutorial Assistant";
    };
    public create(name: string): XCalcPlayer {
        return new XCalcTutorialPlayer(name);
    };
    public getSupportPlayerClassName() {
        return "XCalcTutorialPlayer";
    };
    public restoreFromPlainObject(obj: any, engine: XCalcGameEngine): XCalcPlayer {
        if (engine == null) return null;
        if (!(engine instanceof XCalcGameEngine)) return null;
        if (obj.type != this.getSupportPlayerClassName()) return null;
        var result: XCalcTutorialPlayer = new XCalcTutorialPlayer(obj.name);
        result.setUniqueIdFromCreator(this, obj.uniqueId);
        var invArr: XCalc[] = [];
        for (var idx = 0; idx < obj.inventory.length; idx++) {
            var newCard: XCalc = new XCalc();
            newCard.no = obj.inventory[idx].no;
            newCard.op = obj.inventory[idx].op;
            newCard.setUniqueId(engine, obj.inventory[idx].uniqueId);
            invArr.push(newCard);
        }
        result.setInventory(invArr, engine);
        var appArr: XCalc[] = [];
        for (var adx = 0; adx < obj.applied.length; adx++) {
            var newCard: XCalc = new XCalc();
            newCard.no = obj.applied[adx].no;
            newCard.op = obj.applied[adx].op;
            newCard.setUniqueId(engine, obj.applied[adx].uniqueId);
            appArr.push(newCard);
        }
        result.setApplied(appArr, engine);
        result.setDifficulty(obj.difficulty, engine);
        result.setCustomAIScript(obj.customAIScript, engine);
        return result;
    };
    public isUserSelect(): boolean { // false 시 플레이어 종류 목록에 보이지 않음
        return false;
    };
};

class XCalcGameMode extends ModuleObject {
    protected totals: XCalc[] = [];
    public constructor() {
        super("X Card Game Mode", "X Card Game Undefined Mode");
    };
    public getClassName(): string {
        return "XCalcGameMode";
    };
    public isGameAvailable(engine: XCalcGameEngine, players: XCalcPlayer[]): boolean {
        return (players.length >= 2);
    };
    public createPlayers(engine: XCalcGameEngine): XCalcPlayer[] {
        return null; // null 을 넣으면 메인화면에서 플레이어 지정 가능, null이 아니면 플레이어 지정 불가능하고 여기서 리턴한 대로 플레이어가 설정되며 플레이어 이름만 변경 가능
    };
    public init(playerCount: number) {
        this.totals = [];
        var starts = this.getStartCardNumber();
        var ends = this.getEndCardNumber();
        for (var pdx = 0; pdx < playerCount; pdx++) {
            for (var idx: number = starts; idx <= ends; idx++) {
                for (var cdx = 0; cdx <= 2; cdx++) {
                    var newCard: XCalc = new XCalc();
                    if (cdx == 0) newCard.op = '+';
                    if (cdx == 1) newCard.op = '-';
                    if (cdx == 2) newCard.op = '×';
                    newCard.no = idx;
                    this.totals.push(newCard);
                }
            }
        }
        hjow_ramdomizeArrayOrder(this.totals);
    };
    public getStartCardNumber(): number {
        return -1;
    };
    public getEndCardNumber(): number {
        return 10;
    };
    public playerInvList(player: XCalcPlayer): XCalc[] {
        var result: XCalc[] = [];
        return result;
    };
    public deckList(): XCalc[] {
        var result: XCalc[] = [];
        return result;
    };
    public getEachPlayerTimeLimit(player: XCalcPlayer, engine: XCalcGameEngine): number {
        return 30;
    };
    public getHideTime(player: XCalcPlayer, engine: XCalcGameEngine): number {
        if (player.isUserControllable()) return 30;
        return 2;
    };
    public needHide(player: XCalcPlayer, engine: XCalcGameEngine): boolean {
        if (player instanceof XCalcAIPlayer) return false;
        return true;
    };
    public startGame(engine: XCalcGameEngine, players: XCalcPlayer[], deckObj: XCalc[]): boolean { // 게임 시작 시 동작 처리, true 리턴 시 작업 직후 기본 모드 게임 준비 및 시작 처리를 수행함, false 리턴 시 이 메소드 끝나고 바로 게임이 진행됨
        return true;
    };
    public afterPrepareStartDefaultGame(engine: XCalcGameEngine, players: XCalcPlayer[], deckObj: XCalc[]) { // 기본 모드 게임 준비 및 시작 처리 끝난 직후 수행함. 기본 모드 준비 작업 수행 시에만 호출됨에 유의!

    };
    public beforeNextTurnWork(engine: XCalcGameEngine, players: XCalcPlayer[], deckObj: XCalc[], turnNumber: number) { // 다음 플레이어에게 차례 넘기는 작업 수행 직전 호출

    };

    public afterNextTurnWork(engine: XCalcGameEngine, players: XCalcPlayer[], deckObj: XCalc[], turnNumber: number) { // 다음 플레이어에게 차례 넘기는 작업 수행 직후 호출

    };
    public onFinishGame(engine: XCalcGameEngine, players: XCalcPlayer[], deckObj: XCalc[]) { // 게임 끝나고 호출

    };
    public afterResultPage(engine: XCalcGameEngine, players: XCalcPlayer[], deckObj: XCalc[]) { // 게임 끝나고 결과 화면 로드 후 호출

    };
    public processPoint(player: XCalcPlayer, beforeCalculated: TBigInt): TBigInt { // 점수 계산 직후 점수에 추가 연산 (리턴된 값이 계산 결과로 적용됨 ! any타입 매개변수 객체로는 bigInt 객체가 들어올 예정)
        return beforeCalculated;
    };
    public isReplayAllowed() {
        return true;
    };
};

class XCalcGameDefaultMode extends XCalcGameMode {
    public constructor() {
        super();
        this.name = "Normal Mode";
        this.desc = "Each player will get 10 cards at the game starts.";
    };
    public getClassName(): string {
        return "XCalcGameDefaultMode";
    };
    protected playerStartCardCount(): number {
        return 10;
    };
    public playerInvList(player: XCalcPlayer): XCalc[] {
        var result: XCalc[] = [];
        var cardCnt = this.playerStartCardCount();
        for (var idx = 0; idx < cardCnt; idx++) {
            var cardOne: XCalc = this.totals[0];
            hjow_removeItemFromArray(this.totals, 0);
            result.push(cardOne);
        }
        return result;
    };
    public deckList(): XCalc[] {
        return hjow_simpleCloneArray(this.totals);
    };
};


class XCalcGameSpeedMode extends XCalcGameDefaultMode {
    public constructor() {
        super();
        this.name = "Speed Mode";
        this.desc = "Each player will get 7 cards at the game starts. The number of card will be -1 to 5.";
    };
    public getClassName(): string {
        return "XCalcGameSpeedMode";
    };
    protected playerStartCardCount(): number {
        return 7;
    };
    public getEndCardNumber(): number {
        return 5;
    };
    public getEachPlayerTimeLimit(player: XCalcPlayer, engine: XCalcGameEngine): number {
        return 20;
    };
};

class XCalcGameMultiplylessMode extends XCalcGameDefaultMode {
    public constructor() {
        super();
        this.name = "Multiplyless Mode";
        this.desc = "There is no × card.";
    };
    public init(playerCount: number) {
        this.totals = [];
        var starts = this.getStartCardNumber();
        var ends = this.getEndCardNumber();
        for (var pdx = 0; pdx < playerCount; pdx++) {
            for (var idx: number = starts; idx <= ends; idx++) {
                for (var cdx = 0; cdx <= 1; cdx++) {
                    var newCard: XCalc = new XCalc();
                    if (cdx == 0) newCard.op = '+';
                    if (cdx == 1) newCard.op = '-';
                    newCard.no = idx;
                    this.totals.push(newCard);
                }
            }
        }
        hjow_ramdomizeArrayOrder(this.totals);
    };
    public getStartCardNumber(): number {
        return 0;
    };
    public getClassName(): string {
        return "XCalcGameMultiplylessMode";
    };
};

class XCalcGamePluslessMode extends XCalcGameDefaultMode {
    public constructor() {
        super();
        this.name = "Plusless Mode";
        this.desc = "There is no ＋ card.";
    };
    public init(playerCount: number) {
        this.totals = [];
        var starts = this.getStartCardNumber();
        var ends = this.getEndCardNumber();
        for (var pdx = 0; pdx < playerCount; pdx++) {
            for (var idx: number = starts; idx <= ends; idx++) {
                for (var cdx = 0; cdx <= 1; cdx++) {
                    var newCard: XCalc = new XCalc();
                    if (cdx == 0) newCard.op = '×';
                    if (cdx == 1) newCard.op = '-';
                    newCard.no = idx;
                    this.totals.push(newCard);
                }
            }
        }
        hjow_ramdomizeArrayOrder(this.totals);
    };
    public getClassName(): string {
        return "XCalcGamePluslessMode";
    };
};

class XCalcGameTutorial extends XCalcGameSpeedMode {
    public constructor() {
        super();
        this.name = "Tutorial";
        this.desc = "Try this first to learn about this game.";
    };
    
    public getClassName(): string {
        return "XCalcGameTutorial";
    };
    public isGameAvailable(engine: XCalcGameEngine, players: XCalcPlayer[]): boolean {
        return true;
    };
    public createPlayers(engine: XCalcGameEngine): XCalcPlayer[] {
        var results: XCalcPlayer[] = [];
        var newCardHaves: XCalc[] = [];
        var newCard: XCalc = null;

        var newPlayer: XCalcPlayer = new XCalcUserPlayer(hjow_trans("Player"));
        newPlayer.setUniqueIdFromMode(this, "p0");
        results.push(newPlayer);

        newPlayer = new XCalcTutorialPlayer(hjow_trans("AI") + " 1");
        newPlayer.setUniqueIdFromMode(this, "p1");
        results.push(newPlayer);

        newPlayer = new XCalcTutorialPlayer(hjow_trans("AI") + " 2");
        newPlayer.setUniqueIdFromMode(this, "p2");
        results.push(newPlayer);

        return results; // 메인화면에서 플레이어 설정 고정
    };
    public init(playerCount: number) {
        this.totals = [];
    };
    public getStartCardNumber(): number {
        return -1;
    };
    public getEndCardNumber(): number {
        return 10;
    };
    public playerInvList(player: XCalcPlayer): XCalc[] {
        var result: XCalc[] = [];
        var playerUniq: string = player.getUniqueId();

        if (playerUniq == 'p0') {
            var newCard: XCalc = new XCalc();
            newCard.op = '+';
            newCard.no = 3;
            result.push(newCard);

            newCard = new XCalc();
            newCard.op = '-';
            newCard.no = 3;
            result.push(newCard);
        }

        return result;
    };
    public deckList(): XCalc[] {
        var result: XCalc[] = [];
        return result;
    };
    public getEachPlayerTimeLimit(player: XCalcPlayer, engine: XCalcGameEngine): number {
        return 120;
    };
    public getHideTime(player: XCalcPlayer, engine: XCalcGameEngine): number {
        if (player.isUserControllable()) return 30;
        return 2;
    };
    public needHide(player: XCalcPlayer, engine: XCalcGameEngine): boolean {
        if (player instanceof XCalcAIPlayer) return false;
        return true;
    };
    public startGame(engine: XCalcGameEngine, players: XCalcPlayer[], deckObj: XCalc[]): boolean { // 게임 시작 시 동작 처리, true 리턴 시 작업 직후 기본 모드 게임 준비 및 시작 처리를 수행함, false 리턴 시 이 메소드 끝나고 바로 게임이 진행됨
        return true;
    };
    public afterPrepareStartDefaultGame(engine: XCalcGameEngine, players: XCalcPlayer[], deckObj: XCalc[]) { // 기본 모드 게임 준비 및 시작 처리 끝난 직후 수행함. 기본 모드 준비 작업 수행 시에만 호출됨에 유의!
        engine.setTurnIndex(0, this);
        var newPlayer: XCalcPlayer = null;
        var newCardHaves: XCalc[] = [];
        var newCard: XCalc = null;

        newPlayer = players[0];
        newCardHaves = [];
        newCard = new XCalc();
        newCard.setUniqueId(engine, "pc01");
        newCard.no = 5;
        newCard.op = "＋";
        newCardHaves.push(newCard);
        newCard = new XCalc();
        newCard.setUniqueId(engine, "pc02");
        newCard.no = 6;
        newCard.op = "－";
        newCardHaves.push(newCard);
        newCard = new XCalc();
        newCard.setUniqueId(engine, "pc02");
        newCard.no = -1;
        newCard.op = "×";
        newCardHaves.push(newCard);
        newPlayer.setInventory(newCardHaves, engine);

        newPlayer = players[1];
        newCardHaves = [];
        newCard = new XCalc();
        newCard.setUniqueId(engine, "pc01");
        newCard.no = 5;
        newCard.op = "×";
        newCardHaves.push(newCard);
        newCard = new XCalc();
        newCard.setUniqueId(engine, "pc02");
        newCard.no = 3;
        newCard.op = "×";
        newCardHaves.push(newCard);
        newCard = new XCalc();
        newCard.setUniqueId(engine, "pc02");
        newCard.no = 4;
        newCard.op = "×";
        newCardHaves.push(newCard);
        newPlayer.setInventory(newCardHaves, engine);
        newCardHaves = [];
        newCard = new XCalc();
        newCard.no = 7;
        newCard.op = "×";
        newCardHaves.push(newCard);
        newPlayer.setApplied(newCardHaves, engine);

        newPlayer = players[2];
        newCardHaves = [];
        newCard = new XCalc();
        newCard.setUniqueId(engine, "pc01");
        newCard.no = 5;
        newCard.op = "×";
        newCardHaves.push(newCard);
        newCard = new XCalc();
        newCard.setUniqueId(engine, "pc02");
        newCard.no = 3;
        newCard.op = "×";
        newCardHaves.push(newCard);
        newCard = new XCalc();
        newCard.setUniqueId(engine, "pc02");
        newCard.no = 4;
        newCard.op = "×";
        newCardHaves.push(newCard);
        newPlayer.setInventory(newCardHaves, engine);
        newCardHaves = [];
        newCard = new XCalc();
        newCard.no = 6;
        newCard.op = "－";
        newCardHaves.push(newCard);
        newCard = new XCalc();
        newCard.no = 7;
        newCard.op = "－";
        newCardHaves.push(newCard);
        newPlayer.setApplied(newCardHaves, engine);

        engine.setPauseTimeLimit(true, this);
        
    };
    public beforeNextTurnWork(engine: XCalcGameEngine, players: XCalcPlayer[], deckObj: XCalc[], turnNumber: number) { // 다음 플레이어에게 차례 넘기는 작업 수행 직전 호출

    };

    public afterNextTurnWork(engine: XCalcGameEngine, players: XCalcPlayer[], deckObj: XCalc[], turnNumber: number) { // 다음 플레이어에게 차례 넘기는 작업 수행 직후 호출

    };
    public onFinishGame(engine: XCalcGameEngine, players: XCalcPlayer[], deckObj: XCalc[]) { // 게임 끝나고 호출

    };
    public processPoint(player: XCalcPlayer, beforeCalculated: TBigInt): TBigInt { // 점수 계산 직후 점수에 추가 연산 (리턴된 값이 계산 결과로 적용됨 ! any타입 매개변수 객체로는 bigInt 객체가 들어올 예정)
        return beforeCalculated;
    };
    public isReplayAllowed() {
        return false;
    };
};

var hjow_xcalc_addGameMode = null;
var hjow_xcalc_addPlayerType = null;

class XCalcGameEngine extends ModuleObject {
    protected version: string = "0.0.7";
    protected placeArea: string = null;
    protected gameModeList: XCalcGameMode[] = [];
    protected gameModeIndex: number = 0;
    protected playerTypes: XCalcPlayerCreator[] = [];
    protected gameStarted: boolean = false;
    protected timers: IntervalTimer[] = [];
    protected players: XCalcPlayer[] = [];
    protected deck: XCalc[] = [];
    protected beforeSelectedPlayerType: string = null;
    protected turnPlayerIndex: number = 0;
    protected turnPlayerTime: number = 0;
    protected turnNumber: number = 0;
    protected beforeTurnPlayerIndex: number = 0;
    protected needHideScreen: boolean = false;
    protected hideScreenTime: number = 0;
    protected pauseTimeLimit: boolean = false;
    protected showResult: boolean = false;
    protected resultReason: string = null;
    protected turnChanging: boolean = false;
    protected actPlayerTurnRequest: boolean = false;
    protected actPlayerTurnStopRequest: boolean = false;
    protected replay: XCalcReplay = null;
    protected showSettings: boolean = false;
    protected debugMode: boolean = false;
    protected addiRefFunc: Function = null;

    public constructor(plcArea: string = '.hjow_xcalc_style_place', additionalRefreshFunction: Function = null, debugMode: boolean = false) {
        super("X Card", "X Card Game Core Engine");
        if (typeof (plcArea) != 'string') {
            hjow_error('The parameter should be a string which is jQuery-selector form.');
            return;
        }
        this.placeArea = String(plcArea);
        hjow_prepareJQuery();
        jq(plcArea).addClass('hjow_xcalc_style_place');
        jq(plcArea).css('overflow-x', 'hidden');
        jq(plcArea).css('overflow-y', 'auto');
        this.addiRefFunc = additionalRefreshFunction;
        this.debugMode = debugMode;
        if (debugMode) {
            hjow_putEngine(this);
            jq('body').css('overflow-y', 'scroll');
        }
    };
    public getClassName(): string {
        return "XCalcGameEngine";
    };
    public getVersion() {
        return this.version;
    };
    public init(): XCalcGameEngine {
        this.initEngine();
        this.initDom();
        this.applyPropertiesBefore();
        this.title(); // 화면이 한번 로딩됨
        this.applyPropertiesAfter();
        this.initTheme(0, true);
        return this;
    };
    protected prepareFirstProp() {
        this.deck = [];
        this.players = [];

        this.playerTypes = [];
        this.playerTypes.push(new XCalcUserPlayerCreator());
        this.playerTypes.push(new XCalcAIPlayerCreator());
        this.playerTypes.push(new XCalcTutorialPlayerCreator());

        this.players.push(new XCalcUserPlayer(hjow_trans("User")));
        this.players.push(new XCalcAIPlayer("AI " + this.players.length));
        this.players.push(new XCalcAIPlayer("AI " + this.players.length));
        this.players.push(new XCalcAIPlayer("AI " + this.players.length));

        this.gameModeList.push(new XCalcGameDefaultMode());
        this.gameModeList.push(new XCalcGameSpeedMode());
        this.gameModeList.push(new XCalcGameMultiplylessMode());
        this.gameModeList.push(new XCalcGamePluslessMode());
        // this.gameModeList.push(new XCalcGameTutorial());

        var selfObj = this;
        if (hjow_xcalc_addGameMode != null) {
            hjow_xcalc_addGameMode = function (gameMode) {
                selfObj.gameModeList.push(gameMode);
                selfObj.refreshPage();
            };
            hjow_xcalc_addPlayerType = function (playerType) {
                selfObj.playerTypes.push(playerType);
                selfObj.refreshPage();
            };
        }

        var useBrowserSelectOpt = this.getProperty('use_browser_select');
        var useBrowserInputOpt = this.getProperty('use_browser_input');
        var screenApplySpeed = this.getProperty('screen_apply_speed');
        if (useBrowserSelectOpt == null || typeof (useBrowserSelectOpt) == 'undefined' || useBrowserSelectOpt == '') {
            if (hjow_getPlatform() == 'android' || hjow_getPlatform() == 'windowsuniversal') {
                useBrowserSelectOpt = "false";
            } else {
                useBrowserSelectOpt = "true";
            }
            this.setProperty('use_browser_select', useBrowserSelectOpt);
        }

        if (useBrowserInputOpt == null || typeof (useBrowserInputOpt) == 'undefined' || useBrowserInputOpt == '') {
            if (hjow_getPlatform() == 'android') {
                useBrowserInputOpt = "false";
            } else {
                useBrowserInputOpt = "true";
            }
            this.setProperty('use_browser_input', useBrowserInputOpt);
        }
        
        if (screenApplySpeed == null || typeof (screenApplySpeed) == 'undefined' || screenApplySpeed == '') {
            screenApplySpeed = "300";
            if (hjow_parseBoolean(useBrowserSelectOpt)) screenApplySpeed = "100";
            this.setProperty('screen_apply_speed', screenApplySpeed);
        }
    };
    protected applyProperties() {
        this.applyPropertiesBefore();
        this.applyPropertiesAfter();
    };
    protected applyPropertiesBefore() {
        var customLocale = this.getProperty("locale");
        if (customLocale != null && customLocale != '') {
            hjow_selectedLocale = customLocale;
        }
    };
    protected applyPropertiesAfter() {
        var useAdvanceFeatOpt = this.getProperty("use_advanced_features");
        if (useAdvanceFeatOpt != null) {
            if (hjow_parseBoolean(useAdvanceFeatOpt)) jq(this.placeArea).find('.advanceMode').show();
            else jq(this.placeArea).find('.advanceMode').hide();
        } else {
            jq(this.placeArea).find('.advanceMode').hide();
        }
        this.prepareHowToPlayDialog();
    };
    public getPlaceArea() {
        return jq(this.placeArea);
    };
    initEngine() {
        // hjow_putEngine(this);
        this.prepareLanguageSets();
        this.setProperty('localStorageAvailable', String(hjow_checkLocalStorageAvailable()));
        this.load();
        if (this.properties == null) this.properties = new Properties();
        this.prepareFirstProp();
    };
    initDom() {
        jq(this.placeArea).addClass('hjow_xcalc_style_place');

        var bodyHtml: string = "<div class='page page_main section'></div>\n";
        bodyHtml += "<div class='page page_game section'></div>\n";
        bodyHtml += "<div class='page page_hide section'></div>\n";
        bodyHtml += "<div class='page page_result section'></div>\n";
        bodyHtml += "<div class='page page_set section'></div>\n";
        bodyHtml += "<div class='toolbar footer'></div>\n";
        
        jq(this.placeArea).html(hjow_toStaticHTML(bodyHtml));

        jq('body').append("<div class='hjow_xcalc_how_to_play_dialog' style='width: 400px; height: 300px; display: none' title=\"" + hjow_serializeString(hjow_trans("How to play")) + "\"></div>");
        this.prepareHowToPlayDialog();

        var selfObj = this;
        hjow_prepareDialogLog();
        hjow_prepareDialogAlert();
        hjow_workOnScreenSizeChanged(function () {
            selfObj.refreshPage(false);
        });

        this.refreshPage();
    };
    initTheme(themeType: number = 0, atFirst: boolean = false) {
        if (themeType == 0) {
            this.initTheme(1, atFirst);
            this.initTheme(2, atFirst);
            return;
        }
        
        var themeStr = this.getProperty('theme_' + themeType);
        if ((themeStr == null || themeStr == '') && atFirst) {
            themeStr = this.getDefaultTheme(themeType);
            this.setProperty('theme_' + themeType, themeStr);
        }
        if (themeStr == null) return;
        themeStr = themeStr.trim();
        if (themeStr == '') return;
        try {
            var themes: Properties[] = [];
            var parsedObj = JSON.parse(themeStr);
            if (hjow_isArray(parsedObj)) {
                for (var pdx = 0; pdx < parsedObj.length; pdx++) {
                    var theme: Properties = new Properties();
                    theme.fromPlainObject(parsedObj[pdx]);
                    themes.push(theme);
                }
            } else {
                var theme: Properties = new Properties();
                theme.fromJSON(themeStr);
                themes.push(theme);
            }

            for (var pdx = 0; pdx < themes.length; pdx++) {
                var theme: Properties = themes[pdx];
                var keys: string[] = theme.keyList();
                for (var idx = 0; idx < keys.length; idx++) {
                    var keyOne = keys[idx];
                    var value = theme.get(keyOne);
                    var jqSel = jq(keyOne);
                    if (jqSel.length >= 1) {
                        jqSel.each(function () {
                            jq(this).css('cssText', value);
                        });
                    }
                }
            }
        } catch (e) {
            hjow_error(e);
        }
    };
    protected getSelectedGameMode(): XCalcGameMode {
        return this.gameModeList[this.gameModeIndex];
    };
    protected getPlayerNowTurn(): XCalcPlayer {
        return this.players[this.turnPlayerIndex];
    };
    public isGameOn(): boolean {
        return this.gameStarted;
    };
    protected clearAllPlayers() {
        for (var idx = 0; idx < this.players.length; idx++) {
            this.players[idx].resetCards();
        }
    };
    public setTurnIndex(turnPlayerIndex: number, mode: XCalcGameMode) {
        if (mode == null) return;
        if (!(mode instanceof XCalcGameMode)) return;
        if (mode.getUniqueId() != this.getSelectedGameMode().getUniqueId()) return;
        this.turnPlayerIndex = turnPlayerIndex;
    };
    public setTurnTime(turnPlayerTime: number, mode: XCalcGameMode) {
        if (mode == null) return;
        if (!(mode instanceof XCalcGameMode)) return;
        if (mode.getUniqueId() != this.getSelectedGameMode().getUniqueId()) return;
        this.turnPlayerTime = turnPlayerTime;
    };
    public title() {
        this.gameStarted = false;
        // this.stopAllTimer(); // 타이머 종료 시 MS Edge 에서 게임 다시 시작 시 정상동작이 안됨
        this.clearAllPlayers();
        this.refreshPage();
    };
    public startGame() {
        this.applyInputs();

        hjow_log(hjow_trans("The game is preparing to start."));

        // 게임 모드별 처리
        var gameMode: XCalcGameMode = this.getSelectedGameMode();

        hjow_log(hjow_trans("Mode") + " : " + hjow_trans(gameMode.getName()));
        hjow_log(hjow_trans(gameMode.getDescription()));

        var needDefaultAction = gameMode.startGame(this, this.players, this.deck);
        if (needDefaultAction) { // 기본 모드 처리
            // 카드 분배
            this.spreadCards();

            hjow_log(hjow_trans("Cards is shuffled."));

            // 처음 스타트하는 플레이어 지정
            this.turnPlayerIndex = Math.round((Math.random() * this.players.length) + 0.01);
            if (this.turnPlayerIndex < 0) this.turnPlayerIndex = 0;
            if (this.turnPlayerIndex >= this.players.length - 1) this.turnPlayerIndex = this.players.length - 1;

            var turnPlayer: XCalcPlayer = this.getPlayerNowTurn();
            
            // 제한 시간 세팅 (처음 시작하는 플레이어는 1초 혜택)
            this.turnPlayerTime = this.getSelectedGameMode().getEachPlayerTimeLimit(turnPlayer, this) + 1;

            // 시간 제한
            var selfObj = this;
            var selfAny = this.getSelfObject();
            this.addTimerIfNotExistName("LimitTimer", "Restrict the player's time", function () {
                if (selfObj.turnChanging) return;
                if (!selfObj.gameStarted) return;
                if (selfObj.pauseTimeLimit) return;
                if (selfObj.needHideScreen) {
                    selfObj.hideScreenTime -= 1;

                    var hideScreenMax: number = selfObj.gameModeList[selfObj.gameModeIndex].getHideTime(selfObj.players[selfObj.beforeTurnPlayerIndex], selfObj);
                    hjow_setProgressValue('.prog_hide_left_time', selfObj.hideScreenTime / (hideScreenMax * 1.0), selfObj.hideScreenTime + " " + "seconds left");

                    if (selfObj.hideScreenTime <= 0) {
                        selfObj.hideScreenTime = hideScreenMax;
                        selfObj.turnChanging = true;
                        selfAny.events.hide.reveal();
                    }
                } else {
                    var maxVal: number = selfObj.gameModeList[selfObj.gameModeIndex].getEachPlayerTimeLimit(selfObj.players[selfObj.turnPlayerIndex], selfObj);
                    if (maxVal <= 0) maxVal = 1;

                    selfObj.turnPlayerTime -= 1;
                    hjow_setProgressValue('.prog_game_status_bar', selfObj.turnPlayerTime / (maxVal * 1.0), selfObj.turnPlayerTime + " " + "seconds left");

                    if (selfObj.turnPlayerTime <= 0) {
                        selfObj.turnPlayerTime = 999999;
                        selfObj.turnChanging = true;
                        selfAny.events.game.btn_get_from_deck();
                    }
                }
            }, 1000);
            // AI 비동기 처리
            this.addTimerIfNotExistName("AIProcessor", "AI Process", function () {
                if (! selfObj.actPlayerTurnRequest) return;
                if (! selfObj.gameStarted) return;
                if (selfObj.turnChanging) return;
                if (selfObj.needHideScreen) return;

                selfObj.actPlayerTurnRequest = false;
                selfObj.players[selfObj.turnPlayerIndex].actOnTurn(selfObj, selfObj.gameModeList[selfObj.gameModeIndex], selfObj.deck, selfObj.players, selfObj.turnNumber);
            }, 500);
        }

        hjow_log(hjow_replaceStr(hjow_trans("The first turn number is [[NUMBER]]"), "[[NUMBER]]", String(this.turnPlayerIndex)));
        
        this.showSettings = false;
        this.needHideScreen = false;
        this.showResult = false;
        this.turnChanging = false;
        this.gameStarted = true;
        this.turnNumber = 0;

        gameMode.afterPrepareStartDefaultGame(this, this.players, this.deck); // 기본 모드 작업 이후 추가 작업할 내용이 있으면 처리

        if (gameMode.isReplayAllowed() && hjow_parseBoolean(this.getProperty("record_replay"))) {
            this.prepareRecordingReplay();
        }

        hjow_log(hjow_trans("Game is started."));
        if (this.isDebugMode()) hjow_log(hjow_trans("Debug mode was activated."));
        hjow_log(hjow_replaceStr(hjow_trans("Your turn, [[PLAYER]]."), "[[PLAYER]]", this.getPlayerNowTurn().getName()));
        
        this.refreshPage();
        this.actPlayerTurnStopRequest = false;
        this.actPlayerTurnRequest = true;
    };
    public setPauseTimeLimit(pause: boolean, mode: XCalcGameMode) {
        if (mode == null) return;
        if (!(mode instanceof XCalcGameMode)) return;
        if (this.getSelectedGameMode().getUniqueId() != mode.getUniqueId()) return;
        this.pauseTimeLimit = pause;
    };
    protected prepareRecordingReplay() {
        this.replay = new XCalcReplay();
        this.replay.players = [];
        for (var pdx = 0; pdx < this.players.length; pdx++) {
            var plainObj: any = this.players[pdx].toPlainObject(this);
            var cloned: XCalcPlayer = null;
            for (var pcdx = 0; pcdx < this.playerTypes.length; pcdx++) {
                var creator: XCalcPlayerCreator = this.playerTypes[pcdx];
                cloned = creator.restoreFromPlainObject(plainObj, this);
                if (cloned != null) break;
            }
            if (cloned == null) {
                this.replay = null;
                hjow_log(hjow_trans("Some custom player setting is not supported for recording replay."));
                return;
            }
            this.replay.players.push(cloned);
        }
        this.replay.gameMode = this.getSelectedGameMode().getClassName();
        this.replay.deck = [];
        for (var cdx = 0; cdx < this.deck.length; cdx++) {
            var newCardObj = this.deck[cdx].toPlainObjectDetail(this);
            var newCard: XCalc = new XCalc();
            newCard.no = newCardObj.no;
            newCard.op = newCardObj.op;
            newCard.setUniqueId(this, newCardObj.uniqueId);
            this.replay.deck.push(newCard);
        }
    };
    public isActPlayerRequestAlive(): boolean {
        return this.actPlayerTurnRequest && (!this.actPlayerTurnStopRequest);
    };
    public isActPlayerStopRequested(): boolean {
        return this.actPlayerTurnStopRequest;
    };
    public isThisTurn(player: XCalcPlayer): boolean {
        if (this.getPlayerNowTurn().getUniqueId() == player.getUniqueId()) return true;
        return false;
    };
    public getLeftTime(): number {
        return this.turnPlayerTime;
    }
    public isHided(): boolean {
        return this.needHideScreen;
    };
    public setDeck(cards: XCalc[], mode: XCalcGameMode) {
        if (mode == null) return;
        if (!(mode instanceof XCalcGameMode)) return;
        if (this.getSelectedGameMode().getUniqueId() != mode.getUniqueId()) return;

        this.deck = cards;
    };
    protected addTimer(name: string, desc: string, func: Function, timeGap: number = 1000) {
        var newTimer: IntervalTimer = new IntervalTimer(name, desc, func, timeGap);
        this.timers.push(newTimer);
    };
    protected addTimerIfNotExistName(name: string, desc: string, func: Function, timeGap: number = 1000): boolean {
        for (var idx = 0; idx < this.timers.length; idx++) {
            if (this.timers[idx].getName() == name) return false;
        }
        this.addTimer(name, desc, func, timeGap);
        return true;
    };
    protected stopAllTimer() {
        var curIdx: number = 0;
        var preventInfLoop: number = 0;
        while (curIdx < this.timers.length) {
            var timerOne: IntervalTimer = this.timers[curIdx];
            if (! (timerOne instanceof ImportantTimer)) {
                timerOne.stop();
                hjow_removeItemFromArray(this.timers, curIdx);
                curIdx = 0;
                continue;
            }
            curIdx++;
            preventInfLoop++;
            if (preventInfLoop >= 1000 * Math.max(this.timers.length, 1)) {
                hjow_error("Infinite Loop Detected");
                break;
            }
        }
    };
    protected stopTimer(timerName: string): boolean {
        for (var idx = 0; idx < this.timers.length; idx++) {
            var timerOne: IntervalTimer = this.timers[idx];
            if (timerOne.getName() == timerName) {
                timerOne.stop();
                hjow_removeItemFromArray(this.timers, idx);
                return true;
            }
        }
        return false;
    };
    protected spreadCards() {
        var gameMode: XCalcGameMode = this.getSelectedGameMode();
        gameMode.init(this.players.length);

        for (var idx = 0; idx < this.players.length; idx++) {
            var currentPlayer: XCalcPlayer = this.players[idx];
            currentPlayer.resetCards();
            currentPlayer.setInventory(gameMode.playerInvList(currentPlayer), this);
        }

        this.deck = gameMode.deckList();
    };
    protected save() {
        try {
            hjow_saveOnLocalStorage('XCalc', this.properties.serialize());
        } catch (e) {
            hjow_alert(e, hjow_trans('Error'));
        }
    };
    protected load() {
        var localStoreStr: string = hjow_getOnLocalStorage('XCalc');
        if (localStoreStr == null) {
            this.save();
        }
        try {
            this.properties.fromJSON(localStoreStr);
        } catch (e) {
            hjow_error(e);
        }
    };
    protected findPlayer(uniqueId: string): XCalcPlayer {
        for (var idx = 0; idx < this.players.length; idx++) {
            if (this.players[idx].getUniqueId() == uniqueId) {
                return this.players[idx];
            }
        }
        return null;
    };
    protected nextTurn() {
        this.turnChanging = true;
        this.actPlayerTurnStopRequest = true;

        var gameMode: XCalcGameMode = this.getSelectedGameMode();
        gameMode.beforeNextTurnWork(this, this.players, this.deck, this.turnNumber + 1); // 값 수정 전이므로 수정후의 값을 만들어 보냄
        if (!this.gameStarted) { // 게임 모드 쪽에서 게임을 종료했을 수도 있음
            this.refreshPage(false);
            return;
        }

        this.turnNumber = this.turnNumber + 1; // 턴 번호 증가

        var finishGameReasonIfExists: string = this.checkFinishGameCondition();
        if (finishGameReasonIfExists != null) {
            this.resultReason = finishGameReasonIfExists;
            this.finishGame(true);
            return;
        }

        var beforePlayer: XCalcPlayer = this.getPlayerNowTurn();
        if (this.getSelectedGameMode().needHide(beforePlayer, this)) {
            this.hideScreenTime = this.getSelectedGameMode().getHideTime(beforePlayer, this);
            this.needHideScreen = true;
        }

        this.beforeTurnPlayerIndex = this.turnPlayerIndex;
        this.turnPlayerIndex++;
        if (this.turnPlayerIndex >= this.players.length) {
            this.turnPlayerIndex = 0;
        }
        this.turnPlayerTime = this.getSelectedGameMode().getEachPlayerTimeLimit(this.getPlayerNowTurn(), this);
        // this.getPlayerNowTurn().actOnTurn(this, this.getSelectedGameMode(), this.deck, this.players); // 이 시점에서 AI 처리하면 안됨

        if (!this.gameStarted) { // 게임 모드 쪽에서 게임을 종료했을 수도 있음
            this.refreshPage(false);
            return;
        }
        gameMode.afterNextTurnWork(this, this.players, this.deck, this.turnNumber);

        hjow_log(hjow_replaceStr(hjow_trans("Your turn, [[PLAYER]]."), "[[PLAYER]]", this.getPlayerNowTurn().getName()));

        this.actPlayerTurnStopRequest = false;
        this.actPlayerTurnRequest = true;
        this.turnChanging = false;
        this.showSettings = false;
        this.refreshPage(false);
    };
    protected checkFinishGameCondition(): string {
        if (this.deck.length <= 0) return hjow_trans("The deck is empty.");
        for (var idx = 0; idx < this.players.length; idx++) {
            var player: XCalcPlayer = this.players[idx];
            if (player.getInventoryCardCount() <= 0) return hjow_replaceStr(hjow_trans("The player [[PLAYER]] does not have any card."), "[[PLAYER]]", player.getName());
        }
        return null;
    };
    public finishGameFromMode(reason: string, mode: XCalcGameMode) {
        if (mode == null) return;
        if (!(mode instanceof XCalcGameMode)) return;
        if (this.getSelectedGameMode().getUniqueId() != mode.getUniqueId()) return;
        this.resultReason = reason;
        this.finishGame(true);
    };
    protected finishGame(normalReason: boolean = false) {
        //this.stopTimer("LimitTimer"); // timer stop 시 다시 게임시작 후 MS Edge 브라우저에서 동작 안함
        //this.stopTimer("AIProcessor");
        this.actPlayerTurnStopRequest = true;
        this.gameStarted = false;
        this.needHideScreen = false;
        this.showSettings = false;
        this.showResult = true;
        var gameMode: XCalcGameMode = this.getSelectedGameMode();
        gameMode.onFinishGame(this, this.players, this.deck);

        hjow_log(hjow_trans("Game is finished."));
        if (this.isDebugMode()) hjow_log(hjow_trans("Debug mode was activated."));
        
        this.refreshPage(false);
        gameMode.afterResultPage(this, this.players, this.deck);
        this.replay = null; // 화면 리프레시 이후에 리플레이 초기화 (결과 화면에서 리플레이 JSON 출력 후에 초기화하기 위함)
        this.resultReason = null;
    };
    public isDebugMode(): boolean {
        return this.debugMode;
    };
    public refreshPage(heavyRefresh: boolean = true) {
        this.applyInputs();
        if (hjow_getPlatform() == 'android' || hjow_getPlatform() == 'browser' || hjow_getPlatform() == 'windowsuniversal') {
            jq(this.placeArea).find('.selalter_option').off('click');
        }
        var inHeight = window.innerHeight - 20;
        if (jq(this.placeArea).is('.auto_size')) {
            jq(this.placeArea).height(inHeight);
            jq('body').css('height', 'auto');
        }
        if (heavyRefresh) {
            jq(this.placeArea).find('.page_game').html(hjow_toStaticHTML(this.gamePageHTML()));
            jq(this.placeArea).find('.page_main').html(hjow_toStaticHTML(this.mainPageHTML()));
            jq(this.placeArea).find('.page_hide').html(hjow_toStaticHTML(this.hidePageHTML()));
            jq(this.placeArea).find('.page_set').html(hjow_toStaticHTML(this.setPageHTML()));
            // jq(this.placeArea).find('.page_result').html(this.resultPageHTML()); // 아래쪽에서 처리
            this.prepareEvents();
            hjow_input_close();
        }
        var toolbarArea = jq(this.placeArea).find('.toolbar');
        toolbarArea.html(hjow_toStaticHTML(this.toolbarHTML())); // 툴바는 항상 재로드
        if (jq(this.placeArea).is('.auto_size')) {
            var toolbarHeight = toolbarArea.height();
            if (toolbarHeight <= 22) toolbarArea = 22;
            jq(this.placeArea).find('div.page').height(inHeight - (toolbarHeight + 10));
        }
        if (this.needHideScreen) {
            jq(this.placeArea).find('.page:not(.page_hide)').hide();
            this.refreshGame();
            jq(this.placeArea).find('.page_hide').show();
        } else if (this.gameStarted) {
            jq(this.placeArea).find('.page:not(.page_game)').hide();
            this.refreshGame();
            jq(this.placeArea).find('.page_game').show();
        } else if (this.showResult) {
            jq(this.placeArea).find('.page:not(.page_result)').hide();
            jq(this.placeArea).find('.page_result').html(hjow_toStaticHTML(this.resultPageHTML()));
            this.refreshResult();
            jq(this.placeArea).find('.page_result').show();
        } else if (this.showSettings && (!this.debugMode)) {
            jq(this.placeArea).find('.page:not(.page_set)').hide();
            this.refreshSettingPage();
            jq(this.placeArea).find('.page_set').show();
        } else {
            jq(this.placeArea).find('.page:not(.page_main)').hide();
            this.refreshMain();
            jq(this.placeArea).find('.page_main').show();
        }
        if (this.showSettings && this.debugMode) {
            this.refreshSettingPage();
            jq(this.placeArea).find('.page_set').show();
        }
        if (hjow_onRefreshComponents != null && typeof (hjow_onRefreshComponents) != 'undefined') {
            hjow_onRefreshComponents();
        }
        this.initTheme(2, false);
        this.refreshEvents();
        if (this.showSettings && this.debugMode) {
            this.refreshSettingPage();
            jq(this.placeArea).find('.page_set').show();
        }
        if (!hjow_parseBoolean(this.getProperty('use_browser_input'))) {
            hjow_input_init('.need_custom_keyboard');
        }
        if (this.addiRefFunc != null) this.addiRefFunc(heavyRefresh);
    };
    protected refreshMain() {
        jq(this.placeArea).find('.td_player_list').empty();
        var results = "";
        results += "<div class='full player_list_div element e137'>" + "\n";
        results += "<table class='full player_list element e138'>" + "\n";
        if (this.players.length <= 0) {
            results += "   <tr class='tr_player pbasic_none  element'>" + "\n";
            results += "       <td class='td_player_none element'>" + "\n";
            results += "          <span class='label element'>" + hjow_serializeXMLString(hjow_trans("Please add player to play.")) + "</span>" + "\n";
            results += "       </td>" + "\n";
            results += "   </tr>" + "\n";
        } else {
            for (var idx: number = 0; idx < this.players.length; idx++) {
                var currentPlayer: XCalcPlayer = this.players[idx];
                results += "   <tr class='tr_player element pbasic_" + hjow_serializeString(currentPlayer.getUniqueId()) + "'>" + "\n";
                results += "       <td class='td_player element'>" + "\n";
                results += this.eachPlayerMainHTML(currentPlayer);
                results += "       </td>" + "\n";
                results += "   </tr>" + "\n";
            }
        }
        
        results += "   <tr class='tr_player_empty element e139'>" + "\n";
        results += "       <td class='td_player_empty td_player_control element e140'>" + "\n";
        results += "          <select class='sel_player_type player_control element e141'>" + "\n";
        for (var tdx = 0; tdx < this.playerTypes.length; tdx++) {
            var playerType: XCalcPlayerCreator = this.playerTypes[tdx];
            if (playerType.isUserSelect()) {
                var selectedOpt = '';
                if (this.beforeSelectedPlayerType == playerType.getTypeName()) selectedOpt = ' selected';
                results += "          <option value='" + hjow_serializeString(playerType.getTypeName()) + "'" + selectedOpt + ">" + hjow_serializeXMLString(hjow_trans(playerType.getTypeName())) + "</option>" + "\n";
            }
        }
        results += "          </select>" + "\n";
        results += "          <button type='button' class='btn_add_player player_control element e142'>" + hjow_trans("Add") + "</button>" + "\n";
        results += "          <button type='button' class='btn_remove_player player_control element e143'>" + hjow_trans("Remove Last") + "</button>" + "\n";
        results += "       </td>" + "\n";
        results += "   </tr>" + "\n";
        results += "   <tr class='tr_player_empty element e144'>" + "\n";
        results += "      <td class='td_player_empty element e145'>" + "\n";
        results += "      </td>" + "\n";
        results += "   </tr>" + "\n";
        results += "</table>" + "\n";
        results += "</div>" + "\n";
        jq(this.placeArea).find('.td_player_list').html(hjow_toStaticHTML(results));

        if (this.players.length <= 0) {
            var removeBtn = jq(this.placeArea).find('.btn_remove_player');
            removeBtn.prop('disabled', true);
            removeBtn.attr('disabled', 'disabled');
            removeBtn.addClass('disabled');
        }

        var heightVal: number = jq(this.placeArea).height() - 20;
        if (heightVal < 200) heightVal = 200;

        this.initTheme(1, false);
        
        jq(this.placeArea).find('.player_list_div').css('min-height', heightVal - 200 + 'px');
        jq(this.placeArea).find('.player_list_div').css('max-height', heightVal - 100 + 'px');

        var selGameMode = jq(this.placeArea).find('.sel_game_mode');
        selGameMode.find('option').remove();
        for (var mdx = 0; mdx < this.gameModeList.length; mdx++) {
            selGameMode.append(hjow_toStaticHTML("<option value='" + mdx + "'>" + hjow_serializeXMLString(hjow_trans(this.gameModeList[mdx].getName())) + "</option>"));
        }
        selGameMode.val(this.gameModeIndex);

        this.refreshMainGameMode(true);

        for (var idx: number = 0; idx < this.players.length; idx++) {
            this.players[idx].refreshMain(this);
        }
    };
    protected refreshMainGameMode(onRecursives: boolean = false) {
        var gameMode = this.getSelectedGameMode();
        jq(this.placeArea).find('.div_game_mode_desc').text(hjow_trans(gameMode.getDescription()));

        var modeDefinedPlayers: XCalcPlayer[] = gameMode.createPlayers(this);
        if (modeDefinedPlayers != null) { // 게임 모드 내에 아예 플레이어 설정이 탑재된 경우 처리
            if (!onRecursives) { // 메인화면 리프레시 다시 해주어야 하므로 무한반복 방지 조치
                // 설정이 탑재는 됐어도 플레이어 이름은 변경할 수 있으므로, 이름 동기화
                for (var idx = 0; idx < this.players.length; idx++) {
                    for (var mdx = 0; mdx < modeDefinedPlayers.length; mdx++) {
                        if (this.players[idx].getUniqueId() == modeDefinedPlayers[mdx].getUniqueId()) {
                            modeDefinedPlayers[mdx].setName(this.players[idx].getName(), this);
                        }
                    }
                }

                this.players = modeDefinedPlayers;
                this.refreshMain(); // 플레이어 설정을 아예 바꾸어야 하므로 다시 메인화면 리프레시
                return;
            }
            // 이 시점이 되면 메인화면 리프레시 하고 다시 온 것
            jq(this.placeArea).find('.player_control').prop('disabled', true);
            jq(this.placeArea).find('.player_control').attr('disabled', 'disabled');
            jq(this.placeArea).find('.player_control').addClass('disabled');
            jq(this.placeArea).find('.player_control').hide();
        } else {
            jq(this.placeArea).find('.player_control').removeProp('disabled');
            jq(this.placeArea).find('.player_control').removeAttr('disabled');
            jq(this.placeArea).find('.player_control').removeClass('disabled');
            jq(this.placeArea).find('.player_control').show();
        }

        var gameStartAvail: boolean = gameMode.isGameAvailable(this, this.players);
        if (gameStartAvail) {
            jq(this.placeArea).find('.btn_game_start').removeProp('disabled');
            jq(this.placeArea).find('.btn_game_start').removeAttr('disabled');
            jq(this.placeArea).find('.btn_game_start').removeClass('disabled');
        } else {
            jq(this.placeArea).find('.btn_game_start').prop('disabled', true);
            jq(this.placeArea).find('.btn_game_start').attr('disabled', 'disabled');
            jq(this.placeArea).find('.btn_game_start').addClass('disabled');
        }
    };
    protected refreshGame() {
        jq(this.placeArea).find('.table_player_arena_each').removeClass('current_turn');
        var currentPlayer: XCalcPlayer = this.getPlayerNowTurn();
        
        if (currentPlayer.isUserControllable()) {
            jq(this.placeArea).find('.btn_user_control').removeProp('disabled');
            jq(this.placeArea).find('.btn_user_control').removeAttr('disabled');
            jq(this.placeArea).find('.btn_user_control').removeClass('disabled');
        } else {
            jq(this.placeArea).find('.btn_user_control').prop('disabled', true);
            jq(this.placeArea).find('.btn_user_control').attr('disabled', 'disabled');
            jq(this.placeArea).find('.btn_user_control').addClass('disabled');
        }

        jq(this.placeArea).find(".table_player_arena_each.pplace_" + hjow_serializeString(currentPlayer.getUniqueId()) + "").addClass('current_turn');
        jq(this.placeArea).find('.deck_lefts').text(this.deck.length);

        for (var pdx = 0; pdx < this.players.length; pdx++) {
            var playerOne: XCalcPlayer = this.players[pdx];
            var thisTurn: boolean = (pdx == this.turnPlayerIndex);

            var formulaContent = playerOne.listAppliedAsString();

            var placeObj = jq(this.placeArea).find(".pplace_" + hjow_serializeString(playerOne.getUniqueId()));
            placeObj.find(".player_inventory_card_count").text(playerOne.getInventoryCardCount());
            placeObj.find(".point_number").text(playerOne.getCurrentPoint(this.getSelectedGameMode()).toString());
            placeObj.find(".point_number").attr('title', formulaContent);

            // Inventory Synchronizing
            var invenSel = placeObj.find(".select_player_arena.inventory");
            var invenObjs = invenSel.find("option");
            
            var invenOptList: string[] = [];
            invenObjs.each(function () {
                var cardUniqueId = jq(this).attr('value');
                invenOptList.push(cardUniqueId);
            });
            var realInvenList: XCalc[] = playerOne.listInventoryDirect(this);

            var needRemoveInv: string[] = [];
            var needAddInv: XCalc[] = [];

            for (var idx = 0; idx < invenOptList.length; idx++) {
                var exists: boolean = false;
                for (var ridx = 0; ridx < realInvenList.length; ridx++) {
                    if (invenOptList[idx] == realInvenList[ridx].getUniqueId()) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    needRemoveInv.push(invenOptList[idx]);
                }
            }

            for (var ridx = 0; ridx < realInvenList.length; ridx++) {
                var exists: boolean = false;
                for (var idx = 0; idx < invenOptList.length; idx++) {
                    if (invenOptList[idx] == realInvenList[ridx].getUniqueId()) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    needAddInv.push(realInvenList[ridx]);
                }
            }

            for (var rdx = 0; rdx < needRemoveInv.length; rdx++) {
                var elemOne: string = needRemoveInv[rdx];
                invenSel.find("option[value='" + hjow_serializeString(elemOne) + "']").remove();
            }

            for (var rdx2 = 0; rdx2 < needAddInv.length; rdx2++) {
                var targetCard: XCalc = needAddInv[rdx2];
                var newOptionHTML = "<option value='" + hjow_serializeString(targetCard.getUniqueId()) + "'>" + hjow_serializeXMLString(targetCard.toString()) + "</option>";
                invenSel.append(hjow_toStaticHTML(newOptionHTML));
            }

            invenObjs = invenSel.find("option:not('.concealed')");
            var concealedOpt = invenSel.find("option.concealed");
            if (concealedOpt.length == 0) {
                invenSel.append(hjow_toStaticHTML("<option value='' class='concealed'>[" + hjow_trans("Concealed") + "]</option>"));
                concealedOpt = invenSel.find("option.concealed");
            }
            if (thisTurn && (!(playerOne.needToHideInventoryForSelf()))) {
                invenObjs.removeClass('hidden');
                invenObjs.show();
                concealedOpt.addClass('hidden');
                concealedOpt.hide();
            } else {
                invenObjs.addClass('hidden');
                invenObjs.hide();
                concealedOpt.removeClass('hidden');
                concealedOpt.show();
            }

            // Affector Synchronizing
            var affectorSel = placeObj.find(".select_player_arena.affector");
            var affectorObjs = affectorSel.find("option");

            affectorObjs.removeProp('selected');
            affectorObjs.removeAttr('selected');

            var affectorOptList: string[] = [];
            affectorObjs.each(function () {
                var cardUniqueId = jq(this).attr('value');
                affectorOptList.push(cardUniqueId);
            });
            var realAffectorList: XCalc[] = playerOne.listAppliedDirect(this);

            var needRemoveAff: string[] = [];
            var needAddAff: XCalc[] = [];

            for (var idx2 = 0; idx2 < affectorOptList.length; idx2++) {
                var exists: boolean = false;
                for (var ridx = 0; ridx < realAffectorList.length; ridx++) {
                    if (affectorOptList[idx2] == realAffectorList[ridx].getUniqueId()) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    needRemoveAff.push(affectorOptList[idx2]);
                }
            }

            for (var ridx2 = 0; ridx2 < realAffectorList.length; ridx2++) {
                var exists: boolean = false;
                for (var idx = 0; idx < affectorOptList.length; idx++) {
                    if (affectorOptList[idx] == realAffectorList[ridx2].getUniqueId()) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    needAddAff.push(realAffectorList[ridx2]);
                }
            }

            for (var rdx3 = 0; rdx3 < needRemoveAff.length; rdx3++) {
                var elemOne: string = needRemoveAff[rdx3];
                affectorSel.find("option[value='" + hjow_serializeString(elemOne) + "']").remove();
            }

            for (var rdx4 = 0; rdx4 < needAddAff.length; rdx4++) {
                var targetCard: XCalc = needAddAff[rdx4];
                var newOptionHTML = "<option value='" + hjow_serializeString(targetCard.getUniqueId()) + "'>" + hjow_serializeXMLString(targetCard.toString()) + "</option>";
                affectorSel.append(hjow_toStaticHTML(newOptionHTML));
            }

            affectorSel.attr('title', formulaContent);

            affectorObjs = affectorSel.find("option");
            if (affectorObjs.length >= 1) {
                affectorSel.val(jq(affectorObjs[affectorObjs.length - 1]).attr('value'));
                if (hjow_getPlatform() == 'android' || hjow_getPlatform() == 'browser' || hjow_getPlatform() == 'windowsuniversal') {
                    hjow_select_sync(affectorSel);
                }
            }
        }

        this.initTheme(1, false);

        for (var idx: number = 0; idx < this.players.length; idx++) {
            this.players[idx].refreshGame(this);
        }

        var selfObj = this;
        hjow_runAfter(function () {
            selfObj.refreshGameAfterTime();
        }, parseInt(selfObj.getProperty('screen_apply_speed')));
    };
    protected refreshGameAfterTime() {
        var heightVal: number = jq(this.placeArea).height() - 20; // window.innerHeight;
        if (heightVal < 500) heightVal = 500;

        var widthVal: number = jq(this.placeArea).width() - 10; // window.innerWidth;
        if (widthVal < 700) widthVal = 700;

        var minimumPad: number = 20;

        jq(this.placeArea).find('.player_arena_div').css('min-height', heightVal - 100 - minimumPad + 'px');
        jq(this.placeArea).find('.player_arena_div').css('max-height', heightVal - minimumPad + 'px');
        jq(this.placeArea).find('.player_arena_div').css('max-width', widthVal - 5 + 'px');

        jq(this.placeArea).find('.div_player_arena_each').css('min-height', heightVal - 110 - minimumPad + 'px');
        jq(this.placeArea).find('.div_player_arena_each').css('max-height', heightVal - minimumPad + 'px');

        jq(this.placeArea).find('.table_player_arena_each').css('min-height', heightVal - 120 - minimumPad + 'px');
        jq(this.placeArea).find('.table_player_arena_each').css('max-height', heightVal - minimumPad + 'px');

        jq(this.placeArea).find('.table_player_arena_each').each(function () {
            var heightLefts: number = jq(jq(this).find('.player_arena_one_line_layout')[0]).height() * 4;
            var thisHeight: number = jq(this).height();
            if (thisHeight < 220) thisHeight = heightVal - 220;
            if (thisHeight > heightVal - 150) thisHeight = heightVal - 150;

            var heightSelCon = jq(this).find('.td_select_container').height() - 10;
            var heightIn: number = heightSelCon;
            var stdHeightVal: number = thisHeight - heightLefts - 10;
            if (heightIn < stdHeightVal - 100 || heightIn < 200) {
                heightIn = stdHeightVal;
                jq(this).find('.td_select_container').height(heightIn + 10);
                heightSelCon = jq(this).find('.td_select_container').height() - 10;
            }
            if (heightIn < 200) heightIn = 200;
            if (heightIn >= heightSelCon) heightIn = heightSelCon;
            jq(this).find('select').height(heightIn - 10);
        });

        if (!hjow_parseBoolean(this.getProperty('use_browser_select'))) {
            jq(this.placeArea).find('select.need_alter').each(function () {
                hjow_select_init(this);
            });
            var insideHeight = jq(this.placeArea).find('.td_select_container').height();
            if (insideHeight >= heightVal - 350) insideHeight = heightVal - 350;
            jq(this.placeArea).find('.selalter').css('max-height', insideHeight - 5);
            jq(this.placeArea).find('.selalter').css('height', insideHeight - 5);
            // jq(selfObj.placeArea).find('.selalter').css('max-height', heightVal - 150 - 220);
            // jq(selfObj.placeArea).find('.selalter').css('height', heightVal - 150 - 220);
        }
    };
    protected refreshResult() {
        var gameMode: XCalcGameMode = this.getSelectedGameMode();
        jq(this.placeArea).find('.replay_result').hide();
        var finResultLb = jq(this.placeArea).find('.lb_finish_result');
        finResultLb.text('');
        if (this.resultReason != null) finResultLb.text(this.resultReason);
        for (var idx = 0; idx < this.players.length; idx++) {
            var playerOne: XCalcPlayer = this.players[idx];

            var playerBlock = jq(this.placeArea).find(".presult_" + hjow_serializeString(playerOne.getUniqueId()));
            playerBlock.find(".i_name").val(playerOne.getName());
            playerBlock.find(".i_type").val(playerOne.getPlayerTypeName());
            playerBlock.find(".i_point").val(playerOne.getCurrentPoint(gameMode).toString());
            playerBlock.find(".i_affects").val(playerOne.listAppliedAsString());
        }
        this.initTheme(1, false);
        if (this.replay != null) {
            var rsn = this.resultReason;
            this.replay.reason = (rsn == null ? "" : rsn);
            this.resultReplay();
        } else {
            jq(this.placeArea).find('.replay_json').val('');
            jq(this.placeArea).find('.btn_show_replay').hide();
        }
    };
    protected refreshSettingPage() {
        var settingPage = jq(this.placeArea).find('.page_set');

        var recordReplayOpt: string = this.getProperty('record_replay');
        if (recordReplayOpt == null) recordReplayOpt = 'false';

        var recordReplayComp = settingPage.find('.chk_record_replay');
        if (hjow_parseBoolean(recordReplayOpt)) {
            recordReplayComp.attr('checked', 'checked');
            recordReplayComp.prop('checked', true);
        } else {
            recordReplayComp.removeAttr('checked');
            recordReplayComp.removeProp('checked');
        }

        var useAdvancedFeaturesOpt: string = this.getProperty('use_advanced_features');
        if (useAdvancedFeaturesOpt == null) useAdvancedFeaturesOpt = "false";
        
        var useAdvanComp = settingPage.find('.chk_set_use_advanced_features');
        if (hjow_parseBoolean(useAdvancedFeaturesOpt)) {
            useAdvanComp.attr('checked', 'checked');
            useAdvanComp.prop('checked', true);
        } else {
            useAdvanComp.removeAttr('checked');
            useAdvanComp.removeProp('checked');
        }

        var virtualSelectOpt: string = this.getProperty('use_browser_select');
        if (virtualSelectOpt == null) virtualSelectOpt = 'false';

        var virtualSelectComp = settingPage.find('.chk_use_virtual_select');
        if (!hjow_parseBoolean(virtualSelectOpt)) {
            virtualSelectComp.attr('checked', 'checked');
            virtualSelectComp.prop('checked', true);
        } else {
            virtualSelectComp.removeAttr('checked');
            virtualSelectComp.removeProp('checked');
        }

        var virtualKeyboardOpt: string = this.getProperty('use_browser_input');
        if (virtualKeyboardOpt == null) virtualKeyboardOpt = 'false';

        var virtualKeyboardComp = settingPage.find('.chk_use_virtual_keyboard');
        if (!hjow_parseBoolean(virtualKeyboardOpt)) {
            virtualKeyboardComp.attr('checked', 'checked');
            virtualKeyboardComp.prop('checked', true);
        } else {
            virtualKeyboardComp.removeAttr('checked');
            virtualKeyboardComp.removeProp('checked');
        }

        var customLocaleOpt = this.getProperty('locale');
        if (customLocaleOpt == null || customLocaleOpt == '') customLocaleOpt = hjow_selectedLocale;
        if (hjow_selectedLocale == null || typeof (hjow_selectedLocale) == 'undefined') {
            var browserLocale = hjow_getLocaleInfo();
            if (!(typeof (browserLocale) == 'undefined' || browserLocale == null)) {
                var currentLocale: any[] = hjow_makeArrayCompatible(browserLocale);
                if (currentLocale == null || currentLocale.length <= 0) return null;
                var needBreak: boolean = false;
                for (var idx = 0; idx < currentLocale.length; idx++) {
                    for (var ldx = 0; ldx < hjow_languageSets.length; ldx++) {
                        if (currentLocale[idx] == hjow_languageSets[ldx].locale || currentLocale[idx] == hjow_languageSets[ldx].localeAlt) {
                            customLocaleOpt = hjow_languageSets[ldx].locale;
                            needBreak = true;
                            break;
                        }
                    }
                    if (needBreak) break;
                }
            }
        }
        settingPage.find('.sel_language').val(customLocaleOpt);

        this.initTheme(1, false);

        var heightIn: number = settingPage.height();
        var heightPad: number = 50;
        if (this.isDebugMode()) heightPad += 100;
        settingPage.find('.setting_list').css('max-height', (heightIn - heightPad) + 'px');

        var themeScript = this.getProperty('theme_1');
        settingPage.find('.tx_theme_script_1').val('');
        if (themeScript != null && themeScript != '') {
            settingPage.find('.tx_theme_script_1').val(themeScript);
        }

        themeScript = this.getProperty('theme_2');
        settingPage.find('.tx_theme_script_2').val('');
        if (themeScript != null && themeScript != '') {
            settingPage.find('.tx_theme_script_2').val(themeScript);
        }
    };
    protected resultReplay() {
        this.replay.debugModeUsed = this.debugMode;
        var results = this.replay.toPlainObjectDetail(this);
        jq(this.placeArea).find('.replay_json').val(JSON.stringify(results));
        jq(this.placeArea).find('.btn_show_replay').show();
    };
    protected mainPageHTML(): string {
        var results: string = "";
        results += "<table class='element e001 full layout'>" + "\n";
        results += "  <tr class='element e002'>" + "\n";
        results += "     <td class='element e003 td_game_title' colspan='2'>" + "\n";
        results += "        <h2 class='element e004'>" + hjow_serializeXMLString(hjow_trans("X Card")) + "</h2>" + "\n";
        results += "     </td>" + "\n";
        results += "  </tr>" + "\n";
        results += "  <tr class='element e005'>" + "\n";
        results += "     <td class='element e006 td_player_list' colspan='2'>" + "\n";
        
        results += "     </td>" + "\n";
        results += "  </tr>" + "\n";
        results += "  <tr class='element e006'>" + "\n";
        results += "     <td class='element e007 td_game_below td_game_start'>" + "\n";
        results += "        <select class='element e008 sel_game_mode'></select>" + "\n";
        results += "        <button type='button' class='element e009 btn_game_start'>" + hjow_serializeXMLString(hjow_trans("Start Game")) + "</button>" + "\n";
        results += "        <div class='element e010 div_game_mode_desc'></div>" + "\n";
        results += "     </td>" + "\n";
        results += "     <td class='element e163 td_game_below td_game_ads' style='width: 250px;'>" + "\n";
        results += "     </td>" + "\n";
        results += "  </tr>" + "\n";
        results += "</table>" + "\n";
        return results;
    };
    protected setPageHTML(): string {
        var results: string = "";
        results += "<div class='element setting_list e011'>" + "\n";
        results += "<div class='element setting_element e012'>" + "\n";
        results += "   <p class='element e013'>" + "\n";
        results += "      <span class='element e014 label'>" + hjow_serializeXMLString(hjow_trans("Language")) + "</span>" + "\n";
        results += "      <select class='element e015 sel_language'>" + "\n";
        for (var ldx = 0; ldx < hjow_languageSets.length; ldx++) {
            var languageSetOne: LanguageSet = hjow_languageSets[ldx];
            results += "<option value=\"" + hjow_serializeString(languageSetOne.locale) + "\">" + hjow_serializeString(languageSetOne.localeName) + "</option>" + "\n";
        }
        results += "      </select>" + "\n";
        results += "   </p>" + "\n";
        results += "</div>" + "\n";
        results += "<div class='element e016 setting_element'>" + "\n";
        results += "   <p class='element e017'>" + "\n";
        results += "      <input type='checkbox' class='element e018 chk_record_replay'/><span class='label element e159'>" + hjow_serializeXMLString(hjow_trans("Record playing data")) + "</span>" + "\n";
        results += "   </p>" + "\n";
        results += "   <p class='element e019'>" + "\n";
        results += "      <pre class='element e020'>" + "\n";
        results += hjow_serializeXMLString(hjow_trans("Trying to record playing data includes all progress in the game.")) + "\n";
        results += "      </pre>" + "\n";
        results += "   </p>" + "\n";
        results += "</div>" + "\n";
        results += "<div class='element e149 setting_element'>" + "\n";
        results += "   <p class='element e150'>" + "\n";
        results += "      <input type='checkbox' class='element e151 chk_use_virtual_select'/><span class='label element e160'>" + hjow_serializeXMLString(hjow_trans("Use virtual select box")) + "</span>" + "\n";
        results += "   </p>" + "\n";
        results += "   <p class='element e155'>" + "\n";
        results += "      <input type='checkbox' class='element e156 chk_use_virtual_keyboard'/><span class='label element e161'>" + hjow_serializeXMLString(hjow_trans("Use virtual keyboard")) + "</span>" + "\n";
        results += "   </p>" + "\n";
        results += "   <p class='element e152'>" + "\n";
        results += "      <pre class='element e153'>" + "\n";
        results += hjow_serializeXMLString(hjow_trans("Use virtual select boxes and virtual keyboards.")) + "\n";
        results += "      </pre>" + "\n";
        results += "   </p>" + "\n";
        results += "</div>" + "\n";
        results += "<div class='element e021 setting_element'>" + "\n";
        results += "   <p class='element e022'>" + "\n";
        results += "      <input type='checkbox' class='element e023 chk_set_use_advanced_features'/><span class='label'>" + hjow_serializeXMLString(hjow_trans("Show advanced features")) + "</span>" + "\n";
        results += "   </p>" + "\n";
        results += "   <p class='element e023'>" + "\n";
        results += "      <pre class='element e024'>" + "\n";
        results += hjow_serializeXMLString(hjow_trans("Not recommended for beginners of using computer.")) + "\n";
        results += hjow_serializeXMLString(hjow_trans("If you use this features, you can use custom AI scripts.")) + "\n";
        results += hjow_serializeXMLString(hjow_trans("Please check your script for malware before using it.")) + "\n";
        results += "      </pre>" + "\n";
        results += "   </p>" + "\n";
        results += "</div>" + "\n";
        results += "<div class='element e025 setting_element'>" + "\n";
        results += "   <p class='element e026'>" + "\n";
        results += "      <span class='element e027 label'>" + hjow_serializeXMLString(hjow_trans("Theme Script")) + "</span>" + "\n";
        results += "   </p>" + "\n";
        results += "   <p class='element e028'>" + "\n";
        results += hjow_serializeXMLString(hjow_trans("You can paste the styling scripts here.")) + "\n";
        results += "   </p>" + "\n";
        results += "   <p class='element e029'>" + "\n";
        results += "      <textarea class='element e030 tx_theme_script tx_theme_script_1 need_custom_keyboard'></textarea>" + "\n";
        results += "   </p>" + "\n";
        results += "   <p class='element e031'>" + "\n";
        results += "      <textarea class='element e032 tx_theme_script tx_theme_script_2 need_custom_keyboard'></textarea>" + "\n";
        results += "   </p>" + "\n";
        results += "</div>" + "\n";
        results += "<div class='element setting_element scriptTest advanceMode'><input type='text' class='tx_console_run need_custom_keyboard'/><button type='button' class='element btn_console_run need_custom_keyboard'>" + hjow_serializeXMLString(hjow_trans("Run")) + "</button></div>\n";
        results += "</div>" + "\n";
        results += "<div class='element e033 setting_element setting_buttons_bottom'>" + "\n";
        results += "   <p class='element e034'>" + "\n";
        results += "       <button type='button' class='element e035 btn_apply_setting'>" + hjow_serializeXMLString(hjow_trans("Apply")) + "</button>" + "\n";
        results += "       <span class='element label e148 lb_need_restart_to_apply'>" + hjow_serializeXMLString(hjow_trans("Some features will be applied after restart.")) + "</span>" + "\n";
        results += "   </p>" + "\n";
        results += "</div>" + "\n";
        
        return results;
    };
    protected gamePageHTML(): string {
        var results: string = "";
        results += "<table class='element e036 full layout'>" + "\n";
        results += "   <tr class='element e037'>" + "\n";
        results += "       <td class='element e038 td_deck'>" + "\n";
        results += "           <span class='element e039 label'>" + hjow_serializeXMLString(hjow_trans("In deck,")) + " </span><span class='element e040 deck_lefts'>0</span><span class='element e041 label'>" + " " + hjow_serializeXMLString(hjow_trans("cards")) + "</span>" + "\n";
        results += "           <button type='button' class='element e042 btn_user_control btn_get_from_deck'>" + hjow_serializeXMLString(hjow_trans("Get one from deck")) + "</button>" + "\n";
        results += "       </td>" + "\n";
        results += "   </tr>" + "\n";
        results += "   <tr class='element e043'>" + "\n";
        results += "       <td class='element e044 td_player_game_list min_height'>" + "\n";
        results += "          <div class='element e045 player_arena_div'>" + "\n";
        for (var idx = 0; idx < this.players.length; idx++) {
            var currentPlayer: XCalcPlayer = this.players[idx];
            results += this.eachPlayerGameHTML(currentPlayer);
        }
        results += "          </div>" + "\n";
        results += "       </td>" + "\n";
        results += "   </tr>" + "\n";
        results += "   <tr class='element e046'>" + "\n";
        results += "       <td class='element e047 td_game_status'>" + "\n";
        results += "           <span class='element e048 progress prog_game_status_bar'><span class='element e049 progress_in'>" + "</span><span class='element progress_text e147'></span></span>\n";
        results += "       </td>" + "\n";
        results += "   </tr>" + "\n";
        results += "</table>" + "\n";
        return results;
    };
    protected hidePageHTML(): string {
        var results: string = "";
        results += "<table class='element e050 full layout'>" + "\n";
        results += "   <tr class='element e051'>" + "\n";
        results += "      <td class='element e052'>" + "\n";
        results += "          <button type='button' class='element e053 full btn_hide_reveal'>" + hjow_serializeXMLString(hjow_trans("Press this button to continue...")) + "</button>" + "\n";
        results += "      </td>" + "\n";
        results += "   </tr>" + "\n";
        results += "   <tr class='element e054'>" + "\n";
        results += "      <td class='element e055 td_game_status'>" + "\n";
        results += "           <span class='element e056 progress prog_hide_left_time'><span class='progress_in'>" + "</span></span>\n";
        results += "      </td>" + "\n";
        results += "   </tr>" + "\n";
        results += "</table>" + "\n";

        return results;
    };
    protected resultPageHTML(): string {
        var gameMode: XCalcGameMode = this.getSelectedGameMode();
        var results: string = "";
        results += "<table class='element e057 full layout'>" + "\n";
        results += "   <tr class='element e058'>" + "\n";
        results += "      <td class='element e059'>" + "\n";
        results += "         <h3 class='element e060'>" + hjow_serializeXMLString(hjow_trans("Result")) + "</h3>" + "<br/>" + "\n";
        results += "         <span class='element label e149 finish_result'>" + hjow_trans("Reason") + " : </span><span class='element label e150 finish_result lb_finish_result'></span>" + "\n";
        results += "      </td>" + "\n";
        results += "   </tr>" + "\n";
        results += "   <tr class='element e061'>" + "\n";
        results += "      <td class='element e062'>" + "\n"

        var playerOrders: XCalcPlayer[] = hjow_orderPlayerList(this.players, gameMode);

        var orderNo: number = 0;
        var lastPlayerPoint: TBigInt = null;
        for (var idx = 0; idx < playerOrders.length; idx++) {
            var playerOne: XCalcPlayer = playerOrders[idx];
            var playerPoint: TBigInt = playerOne.getCurrentPoint(this.getSelectedGameMode());
            if (lastPlayerPoint == null || lastPlayerPoint.compare(playerPoint) > 0) {
                lastPlayerPoint = playerPoint;
                orderNo++;
            }

            var isLowest = "";
            if (idx == playerOrders.length - 1) isLowest = " order_player_last";

            results += "<table class='element e063 table_each_player_result presult_" + hjow_serializeString(playerOne.getUniqueId()) + " order_player_" + orderNo + isLowest + "'>";
            results += "   <tr class='element e064'>" + "\n";
            results += "      <td class='element e065 label'>" + "\n";
            results += "          <span class='element e066 label'>" + hjow_serializeXMLString(hjow_trans("Name")) + "</span>" + "\n";
            results += "      </td>" + "\n";
            results += "      <td class='element e067'>" + "\n";
            results += "          <input type='text' class='element e068 i_name' disabled='disabled'/>" + "\n";
            results += "      </td>" + "\n";
            results += "      <td class='element e069 label'>" + "\n";
            results += "          <span class='element e070 label'>" + hjow_serializeXMLString(hjow_trans("Type")) + "</span>" + "\n";
            results += "      </td>" + "\n";
            results += "      <td class='element e071'>" + "\n";
            results += "          <input type='text' class='element e072 i_type' disabled='disabled' value='" + hjow_serializeString(playerOne.getPlayerTypeName()) + "'/>" + "\n";
            results += "      </td>" + "\n";
            results += "   </tr>" + "\n";
            results += "   <tr class='element e073'>" + "\n";
            results += "      <td class='element e074 label'>" + "\n";
            results += "          <span class='element e075 label'>" + hjow_serializeXMLString(hjow_trans("Affects")) + "</span>" + "\n";
            results += "      </td>" + "\n";
            results += "      <td colspan='3' class='element e076'>" + "\n";
            results += "          <input type='text' class='element e077 i_affects' disabled='disabled'/>" + "\n";
            results += "      </td>" + "\n";
            results += "   </tr>" + "\n";
            results += "   <tr class='element e078'>" + "\n";
            results += "      <td class='element e079 label'>" + "\n";
            results += "          <span class='element e080 label'>" + hjow_serializeXMLString(hjow_trans("Point")) + "</span>" + "\n";
            results += "      </td>" + "\n";
            results += "      <td colspan='3' class='element e081'>" + "\n";
            results += "          <input type='text' class='element e082 i_point' disabled='disabled'/>" + "\n";
            results += "      </td>" + "\n";
            results += "   </tr>" + "\n";
            results += "</table>";
        }

        results += "      </td>" + "\n"
        results += "   </tr>" + "\n";
        results += "   <tr class='element e083'>" + "\n";
        results += "      <td class='element e084'>" + "\n";
        results += "         <button type='button' class='element e085 btn_end'>" + hjow_serializeXMLString(hjow_trans("OK")) + "</button>" + "\n";
        results += "         <button type='button' class='element e086 btn_show_replay'>" + hjow_serializeXMLString(hjow_trans("See replay code")) + "</button>" + "\n";
        results += "      </td>" + "\n";
        results += "   </tr>" + "\n";
        results += "</table>" + "\n";
        results += "<div class='replay_result element e087'>" + "\n";
        results += "  <div class='lb_replay_result element e162'>" + hjow_serializeXMLString(hjow_trans("Copy and save following codes and paste on the replay player to see progress again.")) + "</div>" + "\n";
        results += "  <textarea class='replay_json element e088' readonly='readonly'></textarea>" + "\n";
        results += "</div>" + "\n";
        
        return results;
    };
    protected eachPlayerMainHTML(player : XCalcPlayer): string {
        var results: string = "";
        results += "<table class='full player_each element e089'>" + "\n";
        results += "   <colgroup>" + "\n";
        results += "       <col class='player_info_basic_label element e090'/>" + "\n";
        results += "       <col class='player_info_basic element e091'/>" + "\n";
        results += "       <col />" + "\n";
        results += "   </colgroup>" + "\n";
        results += "   <tbody>" + "\n";
        results += "       <tr class='element e092'>" + "\n";
        results += "          <td class='element e093 player_info_basic_label'>" + "\n";
        results += "              <span class='label element e094'>" + hjow_serializeXMLString(hjow_trans("Name")) + "</span>" + "\n";
        results += "          </td>" + "\n";
        results += "          <td class='element e095 player_info_basic'>" + "\n";
        var playerNameFieldOpt: string = "";
        if (!player.isNameEditable()) playerNameFieldOpt = " disabled";
        results += "             <input type='text' class='element e096 inp_pname need_custom_keyboard" + playerNameFieldOpt + "' name='pname_" + hjow_serializeString(player.getUniqueId()) + "' value='" + hjow_serializeString(player.getName()) + "'" + playerNameFieldOpt + "/>" + "\n";
        results += "          </td>" + "\n";
        results += "          <td rowspan='2' class='element e097'>" + "\n";
        var customHtml = player.customMainHTML();
        if (customHtml != null) results += customHtml;
        results += "          </td>" + "\n";
        results += "       </tr>" + "\n";
        results += "       <tr class='element e098'>" + "\n";
        results += "          <td class='player_info_basic_label element e099'>" + "\n";
        results += "              <span class='label element e100'>" + hjow_serializeXMLString(hjow_trans("Type")) + "</span>" + "\n";
        results += "          </td>" + "\n";
        results += "          <td class='player_info_basic element e101'>" + "\n";
        results += "             <span class='player_type element e102'>" + hjow_serializeXMLString(hjow_trans(player.getPlayerTypeName())) + "</span>" + "\n";
        results += "          </td>" + "\n";
        results += "       </tr>" + "\n";
        results += "   </tbody>" + "\n";
        results += "</table>" + "\n";
        return results;
    };
    protected eachPlayerGameHTML(player: XCalcPlayer): string {
        var results: string = player.customGameHTML();
        if (results == null || results == "") {
            results = "<div class='element e103 div_player_arena_each pdiv_" + hjow_serializeString(player.getUniqueId()) + "'>";
            results += "<table class='element e104 td_player player_place table_player_arena_each pplace_" + hjow_serializeString(player.getUniqueId()) + "'>" + "\n";
            results += "   <tr class='element e105 player_arena_one_line_layout'>";
            results += "      <td colspan='2' class='element e106 player_arena_one_line_layout'>";
            results += "         <span class='player_name element e107'>" + hjow_serializeXMLString(player.getName()) + "</span>";
            results += "      </td>";
            results += "   </tr>";
            results += "   <tr class='element e108 player_arena_one_line_layout'>";
            results += "      <td class='element e109 player_arena_one_line_layout'>";
            results += "          <span class='element e110 label'>" + hjow_trans("Inventory") + "</span>";
            results += "      </td>";
            results += "      <td class='element e111 player_arena_one_line_layout'>";
            results += "          <span class='element e112 label'>" + hjow_trans("Point Affectors") + "</span>";
            results += "      </td>";
            results += "   </tr>";
            results += "   <tr class='element e113'>";
            results += "      <td class='element e114 td_select_container'>";
            results += "         <select multiple class='element e115 select_player_arena inventory pinventory_" + hjow_serializeString(player.getUniqueId()) + " need_alter'>";

            results += "         </select>";
            results += "      </td>";
            results += "      <td class='element e116 td_select_container'>";
            results += "         <select multiple class='element e117 select_player_arena affector paffector_" + hjow_serializeString(player.getUniqueId()) + " need_alter'>";

            results += "         </select>";
            results += "      </td>";
            results += "   </tr>";
            results += "   <tr class='element e118 player_arena_one_line_layout'>";
            results += "      <td class='element e119 player_arena_one_line_layout'>";
            results += "          <span class='element e120 player_inventory_card_count'>0</span> <span class='label'>" + hjow_serializeXMLString(hjow_trans("Cards")) + "</span>";
            results += "      </td>";
            results += "      <td class='element e121 player_arena_one_line_layout'>";
            results += "          <button type='button' class='element e122 btn_user_control btn_pay_here' data-unique-id=\"" + hjow_serializeString(player.getUniqueId()) + "\">" + hjow_serializeXMLString(hjow_trans("Pay here")) + "</button>";
            results += "      </td>";
            results += "   </tr>";
            results += "   <tr class='element e123 player_arena_one_line_layout'>";
            results += "      <td colspan='2' class='element e124 player_arena_one_line_layout'>";
            results += "          <span class='element e125 point_number ppoint_" + hjow_serializeString(player.getUniqueId()) + "'>0</span> <span class='label element e126'>" + "Points" + "</span>";
            results += "      </td>";
            results += "   </tr>";
            results += "</table>" + "\n";
            results += "</div>";
        }
        return results;
    };
    protected toolbarHTML(): string {
        var results: string = "";
        results += "<div class='element e127 toolbar_element left toolbar_buttons'>";
        if (this.gameStarted) {
            results += "<button type='button' class='element e128 btn_stop_game'>" + hjow_serializeXMLString(hjow_trans("Stop Game")) + "</button> ";
        } else if (this.showSettings) {
            results += "<button type='button' class='element e130 btn_go_main'>" + hjow_serializeXMLString(hjow_trans("Go back to main")) + "</button> ";
        }
        if (jq('.hjow_xcalc_how_to_play_dialog').length >= 1) { // 플레이 영역 밖에 있는 영역임 !
            results += "   <button type='button' class='element e146 btn_show_how_to'> " + hjow_serializeXMLString(hjow_trans("How to play")) + "</button>";
        }
        if ((!this.showSettings) && ((!(this.gameStarted || this.showResult || this.needHideScreen)) || this.isDebugMode())) {
            results += "<button type='button' class='element e129 btn_go_setting'>" + hjow_serializeXMLString(hjow_trans("Settings")) + "</button> ";
        }
        results += "   <button type='button' class='element e131 btn_show_log'> " + hjow_serializeXMLString(hjow_trans("Show Log")) + "</button>";
        results += "   <button type='button' class='element e132 btn_delete_log'>" + hjow_serializeXMLString(hjow_trans("Delete Log")) + "</button>";

        var platformInfo = hjow_getPlatform();
        if (!(platformInfo == 'ios' || platformInfo == 'browser'))
            results += "   <button type='button' class='element e132 btn_exit'>" + hjow_serializeXMLString(hjow_trans("Exit")) + "</button>";
        results += "</div>";
        results += "<div class='element e133 toolbar_element'>";
        results += "<span class='element e134 madeby'>Made by HJOW (hujinone22@naver.com)</span>";
        results += "</div>";

        results += "<div class='element e135 toolbar_element right'>";
        results += "<span class='element e136 version'>v" + this.version + "</span>";
        results += "</div>";
        
        return results;
    };
    protected applyInputs() {
        if (this.gameStarted) return;
        if (this.needHideScreen) return;
        if (this.showResult) return;
        if (jq(this.placeArea).find('.page_main').is(':empty')) return;

        var selGameMode = jq(this.placeArea).find('.sel_game_mode');
        var selectedGameModeVal = selGameMode.val();
        if (selectedGameModeVal != null) { // 화면이 가려져 있으면 값을 못가져옴
            this.gameModeIndex = parseInt(selectedGameModeVal);
        }

        for (var idx = 0; idx < this.players.length; idx++) {
            var playerOne: XCalcPlayer = this.players[idx];
            var playerBlock = jq(this.placeArea).find(".pbasic_" + hjow_serializeString(playerOne.getUniqueId()));
            if (playerBlock.length == 0) continue;
            playerOne.setName(playerBlock.find('.inp_pname').val(), this);
            playerOne.applyInputs(this, this.gameStarted, this.needHideScreen, this.showResult);
        }
    };
    protected applySettings() {
        var settingPage = jq(this.placeArea).find(".page_set");

        var recordRepComp = settingPage.find('.chk_record_replay');
        if (recordRepComp.is(':checked')) {
            this.setProperty('record_replay', 'true');
        } else {
            this.setProperty('record_replay', 'false');
        }

        var useAdvComp = settingPage.find('.chk_set_use_advanced_features');
        if (useAdvComp.is(':checked')) {
            this.setProperty('use_advanced_features', 'true');
        } else {
            this.setProperty('use_advanced_features', 'false');
        }

        var useVirSel = settingPage.find('.chk_use_virtual_select');
        if (useVirSel.is(':checked')) {
            this.setProperty('use_browser_select', 'false');
        } else {
            this.setProperty('use_browser_select', 'true');
        }

        var useVirInp = settingPage.find('.chk_use_virtual_keyboard');
        if (useVirInp.is(':checked')) {
            this.setProperty('use_browser_input', 'false');
        } else {
            this.setProperty('use_browser_input', 'true');
        }

        var localeSel = settingPage.find('.sel_language').val();
        if (!(localeSel == null || typeof (localeSel) == 'undefined')) {
            hjow_selectedLocale = localeSel;
            this.setProperty('locale', localeSel);
        }

        var themeScripts = settingPage.find('.tx_theme_script_1').val();
        if (themeScripts == null) themeScripts = '';
        try {
            if (themeScripts != '') JSON.parse(themeScripts);
        } catch (e) {
            hjow_alert(e, hjow_trans('Error'));
            themeScripts = '';
        }
        this.setProperty('theme_1', themeScripts);

        themeScripts = settingPage.find('.tx_theme_script_2').val();
        if (themeScripts == null) themeScripts = '';
        try {
            if (themeScripts != '') JSON.parse(themeScripts);
        } catch (e) {
            hjow_alert(e, hjow_trans('Error'));
            themeScripts = '';
        }
        this.setProperty('theme_2', themeScripts);
        
        try {
            this.save();
            this.applyProperties(); // 이 작업은 메인화면 돌아간 후에도 한번 더 수행해야 함
        } catch (e) {
            hjow_alert(e, hjow_trans('Error'));
        }
    };
    public payHere(targetPlayerUniqueId: string, cardUniqueId: string): string {
        var player: XCalcPlayer = this.getPlayerNowTurn(); // 현재 턴의 플레이어
        var targetPlayer: XCalcPlayer = this.findPlayer(targetPlayerUniqueId); // 대상 플레이어
        
        var errMsg: string = targetPlayer.canPayByUniqId(cardUniqueId, player);
        if (errMsg != null) {
            hjow_alert(errMsg, hjow_trans('Information'));
            return errMsg;
        }

        var targetCard: XCalc = player.findInventoryCard(this, cardUniqueId);
        var targetPlayerIdx: number = -1;
        for (var pdx = 0; pdx < this.players.length; pdx++) {
            if (targetPlayer.getUniqueId() == this.players[pdx].getUniqueId()) {
                targetPlayerIdx = pdx;
                break;
            }
        }

        errMsg = targetPlayer.payByUniqId(cardUniqueId, player);
        if (errMsg != null) {
            hjow_alert(errMsg, hjow_trans('Information'));
            return errMsg;
        }


        if (this.replay != null) {
            try {
                var action = new XCalcReplayAction();
                var plainObj = targetCard.toPlainObjectDetail(this);
                var cloned: XCalc = new XCalc();
                cloned.no = plainObj.no;
                cloned.op = plainObj.op;
                cloned.setUniqueId(this, plainObj.uniqueId);
                action.card = cloned;
                action.actionPlayerIndex = this.turnPlayerIndex;
                action.payTargetPlayerIndex = targetPlayerIdx;
                action.date = new Date();
                this.replay.actions.push(action);
            } catch (e) {
                hjow_error(e);
                this.replay = null;
            }
        }

        hjow_log("TURN [" + player.getName() + "] : " + hjow_replaceStr(hjow_replaceStr(hjow_trans("Pay the card '[[CARD]]' to the player '[[PLAYER]]'."), "[[CARD]]", targetCard.toString()), "[[PLAYER]]", targetPlayer.getName()));

        this.nextTurn();
        return null;
    };
    protected removeButtonEvent(btnObj) {
        var buttonOne = jq(btnObj);
        if (buttonOne.length >= 1) {
            try {
                buttonOne.removeAttr('onclick');
                buttonOne.off('click');
            } catch (e) { }
        }
    };
    protected removeSelectEvent(selObj) {
        var selOne = jq(selObj);
        if (selOne.length >= 1) {
            try {
                selOne.removeAttr('onchange');
                selOne.off('change');
            } catch (e) { }
        }
    };
    protected reAllocateButtonEvent(btnObj, actFunc): any {
        var buttonOne = jq(btnObj);
        if (buttonOne.length >= 1) {
            this.removeButtonEvent(buttonOne);
            buttonOne.on('click', function () {
                actFunc(jq(this));
                return false;
            });
        }
        return buttonOne;
    };
    protected reAllocateSelectEvent(selObj, actFunc): any {
        var selOne = jq(selObj);
        if (selOne.length >= 1) {
            this.removeSelectEvent(selOne);
            selOne.on('change', function () {
                actFunc(jq(this));
                return false;
            });
        }
        return selOne;
    };
    protected refreshEvents() {
        var selfObj = this;
        var selfAny: any = this.getSelfObject();
        var pageArea = jq(this.placeArea);

        this.removeButtonEvent(pageArea.find('button'));
        this.removeSelectEvent(pageArea.find('select'));

        this.reAllocateButtonEvent(pageArea.find('.btn_game_start'), function (compObj) {
            selfAny.events.main.btn_game_start();
        });

        this.reAllocateButtonEvent(pageArea.find('.btn_add_player'), function (compObj) {
            selfAny.events.main.btn_add_player();
        });

        this.reAllocateButtonEvent(pageArea.find('.btn_remove_player'), function (compObj) {
            selfAny.events.main.btn_remove_player();
        });

        this.reAllocateButtonEvent(pageArea.find('.btn_go_setting'), function (compObj) {
            selfAny.events.main.btn_go_settings();
        });

        this.reAllocateButtonEvent(pageArea.find('.btn_apply_setting'), function (compObj) {
            selfAny.events.main.btn_save_settings();
        });

        this.reAllocateButtonEvent(pageArea.find('.btn_show_log'), function (compObj) {
            hjow_openLogDialog();
        });

        this.reAllocateButtonEvent(pageArea.find('.btn_delete_log'), function (compObj) {
            hjow_deleteLogDialog();
        });

        this.reAllocateSelectEvent(pageArea.find('.sel_game_mode'), function (compObj) {
            selfAny.events.main.sel_mode_changed();
        });

        this.reAllocateButtonEvent(pageArea.find('.btn_get_from_deck'), function (compObj) {
            selfAny.events.game.btn_get_from_deck();
        });

        this.reAllocateButtonEvent(pageArea.find('.btn_go_main'), function (compObj) {
            selfAny.events.main.btn_go_main();
        });

        this.reAllocateButtonEvent(pageArea.find('.btn_hide_reveal'), function (compObj) {
            selfAny.events.hide.reveal();
        });
        
        this.reAllocateButtonEvent(pageArea.find('.btn_pay_here'), function (compObj) {
            selfAny.events.game.btn_pay_here(compObj.attr('data-unique-id'));
        });
        
        this.reAllocateButtonEvent(pageArea.find('.btn_stop_game'), function (compObj) {
            selfAny.events.game.btn_game_stop();
        });

        this.reAllocateButtonEvent(pageArea.find('.btn_end'), function (compObj) {
            selfAny.events.result.title();
        });

        this.reAllocateButtonEvent(pageArea.find('.btn_show_replay'), function (compObj) {
            selfAny.events.result.show_replay();
        });
        
        this.reAllocateButtonEvent(jq('.btn_show_how_to'), function (compObj) {
            selfAny.showHowToPlayDialog();
        });

        this.reAllocateButtonEvent(jq('.btn_console_run'), function (compObj) {
            hjow_log(eval(jq(selfObj.placeArea).find('.tx_console_run').val()));
            hjow_openLogDialog();
        });
        
        this.reAllocateButtonEvent(jq('.btn_exit'), function (compObj) {
            hjow_tryExit();
        });
    };
    protected prepareEvents() {
        var selfObj: XCalcGameEngine = this;
        var selfAny: any = this.getSelfObject(); // 이렇게 안하면 타입스크립트 제한사항 때문에 메소드 부여가 안 됨
        selfAny.events = {};
        selfAny.events.main = {};
        selfAny.events.main.btn_game_start = function () {
            selfObj.startGame();
        };
        selfAny.events.main.btn_add_player = function () {
            var typeOf: string = jq(selfObj.getPlaceArea()).find('.sel_player_type').val();
            var playerCreator: XCalcPlayerCreator = null;
            for (var idx = 0; idx < selfObj.playerTypes.length; idx++) {
                if (selfObj.playerTypes[idx].getTypeName() == typeOf) {
                    playerCreator = selfObj.playerTypes[idx];
                    break;
                }
            }
            if (playerCreator == null) {
                hjow_alert(hjow_trans("Please select correct player type."), hjow_trans('Information'));
                return;
            }

            var newPlayer: XCalcPlayer = playerCreator.create(playerCreator.getTypeName() + " " + selfObj.players.length);
            selfObj.players.push(newPlayer);
            selfObj.beforeSelectedPlayerType = playerCreator.getTypeName();
            selfObj.refreshPage(false);
        };
        selfAny.events.main.btn_remove_player = function () {
            if (selfObj.players.length == 0) return;
            selfObj.players[selfObj.players.length - 1].resetCards();
            hjow_removeItemFromArray(selfObj.players, selfObj.players.length - 1);
            selfObj.refreshPage(false);
        };
        selfAny.events.main.btn_go_settings = function () {
            selfObj.showSettings = true;
            if (!selfObj.isDebugMode()) {
                selfObj.needHideScreen = false;
                selfObj.showResult = false;
            }
            selfObj.refreshPage();
        };
        selfAny.events.main.btn_go_main = function () {
            selfObj.showSettings = false;
            if (! selfObj.isDebugMode()) {
                selfObj.showResult = false;
                selfObj.needHideScreen = false;
                selfObj.gameStarted = false;
            }
            selfObj.refreshPage();
        };
        selfAny.events.main.btn_save_settings = function () {
            if (! hjow_parseBoolean(selfObj.getProperty('localStorageAvailable'))) {
                hjow_alert(hjow_trans('On this platform, local storage saving is not working. Changes will be applied only this time.'));
            }

            selfObj.applySettings();
            if (selfObj.isDebugMode()) {
                selfObj.showSettings = false;
                selfObj.refreshPage();
            } else {
                selfAny.events.main.btn_go_main();
            }
            selfObj.applyProperties();
        };
        selfAny.events.main.sel_mode_changed = function () {
            selfObj.applyInputs();
            selfObj.refreshMainGameMode();
        };
        selfAny.events.game = {};
        selfAny.events.game.btn_get_from_deck = function () {
            var player: XCalcPlayer = selfObj.players[selfObj.turnPlayerIndex];
            var card: XCalc = selfObj.deck[0];
            hjow_removeItemFromArray(selfObj.deck, 0);
            player.addOneOnInventory(card, selfObj);

            if (selfObj.replay != null) {
                try {
                    var action = new XCalcReplayAction();
                    action.card = null;
                    action.actionPlayerIndex = selfObj.turnPlayerIndex;
                    action.payTargetPlayerIndex = -1;
                    action.date = new Date();
                    selfObj.replay.actions.push(action);
                } catch (e) {
                    hjow_error(e);
                    selfObj.replay = null;
                }
            }

            hjow_log("TURN [" + player.getName() + "] : " + hjow_trans("Get one card from deck."));
            selfObj.nextTurn();
        };
        selfAny.events.game.btn_pay_here = function (playerUniqId: string) {
            var player: XCalcPlayer = selfObj.players[selfObj.turnPlayerIndex]; // 현재 턴의 플레이어

            var playerInvenObj = jq(selfObj.getPlaceArea()).find(".pplace_" + hjow_serializeString(player.getUniqueId()) + " .inventory");
            var selectedCardVal = playerInvenObj.val(); // 배열
            if (selectedCardVal.length <= 0) {
                hjow_alert(hjow_trans("Please select your card first."), hjow_trans('Information'));
                return;
            }
            if (selectedCardVal.length > 1) {
                hjow_alert(hjow_trans("Cannot pay multiple cards."), hjow_trans('Information'));
                return;
            }

            selfObj.payHere(playerUniqId, selectedCardVal[0]);
        };
        selfAny.events.game.btn_game_stop = function () {
            selfObj.resultReason = hjow_trans('The user stop the game.');
            selfObj.finishGame(false);
        };
        selfAny.events.hide = {};
        selfAny.events.hide.reveal = function () {
            selfObj.showSettings = false;
            selfObj.needHideScreen = false;
            selfObj.turnChanging = false;
            selfObj.refreshPage(false);
        };
        selfAny.events.result = {};
        selfAny.events.result.title = function () {
            selfObj.showSettings = false;
            selfObj.needHideScreen = false;
            selfObj.gameStarted = false;
            selfObj.showResult = false;
            selfObj.clearAllPlayers();
            selfObj.refreshPage(true);
        };
        selfAny.events.result.show_replay = function () {
            jq(selfObj.getPlaceArea()).find('.btn_show_replay').hide();
            jq(selfObj.getPlaceArea()).find('.replay_result').show();
            jq(selfObj.getPlaceArea()).find('.replay_json').show();
        };
    };
    protected getDefaultTheme(themeType: number): string { // 1인 경우, 창 크기에 비례해서 높이가 조절되기 전에 수행, 2인 경우 후에 수행, 0인 경우 두 경우 모두 수행
        var themeArr: any[] = [];
        var themeOne: any = {};
        
        
        return JSON.stringify(themeArr);
    };
    protected makeThemeElementObject(selector: string, value: string): any {
        var themeOne: any = {};
        themeOne[this.placeArea + ' ' + selector] = value;
        return themeOne;
    };
    protected prepareHowToPlayDialog() {
        var dialogObj = jq('.hjow_xcalc_how_to_play_dialog');

        var htmls = "";
        
        htmls += "<p>";
        htmls += hjow_replaceBr(hjow_trans("There must be at least two players, and there is no maximum limit, but it is recommended that four players play. Support play with simple AI computer.")) + "\n";
        htmls += "</p>";
        htmls += "<p>";
        htmls += hjow_replaceBr(hjow_trans("This game is a turn-based card game.")) + "\n";
        htmls += "</p>";
        htmls += "<p>";
        htmls += hjow_replaceBr(hjow_trans("The cards used in this game are represented by numbers between -1 and 10, and three symbols (＋－×); As such, there are 33 different types of cards in a set of cards.")) + "\n";
        htmls += "</p>";
        htmls += "<p>";
        htmls += hjow_replaceBr(hjow_trans("The game uses as many sets of cards as there are players. For example, if two people play the game, the game will be played with 66 cards.")) + "\n";
        htmls += "</p>";
        htmls += "<p>";
        htmls += hjow_replaceBr(hjow_trans("When the game starts, each player receives 10 cards after shuffling. Place the remaining cards invisible on the 'deck'.")) + "\n";
        htmls += "</p>";
        htmls += "<p>";
        htmls += hjow_replaceBr(hjow_trans("The player will not see the opponent's card.")) + "\n";
        htmls += "</p>";
        htmls += "<p>";
        htmls += hjow_replaceBr(hjow_trans("When you are on your turn, the player either takes a card from the deck, or You must place one card of your own card in place of another player. Cards placed are not available and must be placed for viewing by anyone.")) + "\n";
        htmls += "</p>";
        htmls += "<p>";
        htmls += hjow_replaceBr(hjow_trans("If there is already a card in the player's seat, no cards can be placed there. Only cards with the same number of symbols or symbols at the end can be 'placed'. However, a card with a number of 1 can be placed in a different number or symbol.")) + "\n";
        htmls += "</p>";
        htmls += "<p>";
        htmls += hjow_replaceBr(hjow_trans("If the number of the last card 'placed' is 7, only the owner of the place can place another card.")) + "\n";
        htmls += "</p>";
        htmls += "<p>";
        htmls += hjow_replaceBr(hjow_trans("If there is no card on deck, or someone who doesn't have any card, the game ends and scores should be calculated.")) + "\n";
        htmls += "</p>";
        htmls += "<p>";
        htmls += hjow_replaceBr(hjow_trans("The score is calculated as a mathematical operation of the cards 'placed' for the player. If there are no cards left, it is 0. Calculations are performed in order, regardless of operator.")) + "\n";
        htmls += "</p>";
        htmls += "<p>";
        htmls += hjow_replaceBr(hjow_trans("Player 'A' 's 'placed' cards : [＋5][－5][－6][－6][＋4][×4] Point calculation : (0 ＋ 5 － 5 － 6 － 6 ＋4) × 4 = －32")) + "\n";
        htmls += "</p>";
        htmls += "<p>";
        htmls += hjow_replaceBr(hjow_trans("The player with the highest score wins.")) + "\n";
        htmls += "</p>";
        htmls += "<p>";
        htmls += "<img src='" + hjow_getCurrentLanguageSet().getImgPath() + "layout.png" + "' style='width: 100%;'/>" + "\n";
        htmls += "</p>";
        htmls += "<p>";
        htmls += hjow_replaceBr(hjow_replaceStr(hjow_trans("Please visit [[URL]] to get more."), "[[URL]]", "<a href='https://github.com/HJOW/X-Card/blob/master/README.md' target='blank'>https://github.com/HJOW/X-Card/blob/master/README.md</a>")) + "\n";
        htmls += "</p>";
        
        dialogObj.html(htmls);
    };
    protected showHowToPlayDialog() {
        var dialogObj = jq('.hjow_xcalc_how_to_play_dialog');
        if (dialogObj.length <= 0) return;
        dialogObj.dialog({
            width: 780,
            height: 570
        });
    };
    protected prepareLanguageSets() {
        var newLangSet: LanguageSet = null;

        newLangSet = new LanguageSet();
        newLangSet.locale = "en";
        newLangSet.localeAlt = "en-US";
        newLangSet.localeName = "English";
        newLangSet.stringTable = new Properties();
        hjow_languageSets.push(newLangSet);
        
        newLangSet = new LanguageSet();
        newLangSet.locale = "ko";
        newLangSet.localeAlt = "ko-KR";
        newLangSet.localeName = "한글";
        newLangSet.stringTable = new Properties();
        newLangSet.stringTable.set("Language", "언어");
        newLangSet.stringTable.set("Settings", "설정");
        newLangSet.stringTable.set("Run", "실행");
        newLangSet.stringTable.set("Exit", "종료");
        newLangSet.stringTable.set("Go back to main", "메인으로 돌아가기");
        newLangSet.stringTable.set("Show Log", "로그 보기");
        newLangSet.stringTable.set("Delete Log", "로그 지우기");
        newLangSet.stringTable.set("Apply", "적용");
        newLangSet.stringTable.set("User", "사용자");
        newLangSet.stringTable.set("In deck,", "덱에는, ");
        newLangSet.stringTable.set("cards", "카드들이 있습니다.");
        newLangSet.stringTable.set("Get one from deck", "덱에서 카드 한 장 받기");
        newLangSet.stringTable.set("Inventory", "보유한 카드");
        newLangSet.stringTable.set("Point Affectors", "놓인 카드");
        newLangSet.stringTable.set("Cards", "카드");
        newLangSet.stringTable.set("Pay here", "카드 놓기");
        newLangSet.stringTable.set("X Card", "X Card");
        newLangSet.stringTable.set("X Card Replay Player", "X Card 리플레이 플레이어");
        newLangSet.stringTable.set("Start Game", "게임 시작");
        newLangSet.stringTable.set("Start Replay", "리플레이 재생");
        newLangSet.stringTable.set("Stop Game", "게임 중단");
        newLangSet.stringTable.set("Stop Replay", "리플레이 중단");
        newLangSet.stringTable.set("Press this button to continue...", "계속 진행하려면 이 버튼을 클릭해 주세요.");
        newLangSet.stringTable.set("Result", "결과");
        newLangSet.stringTable.set("Reason", "이유");
        newLangSet.stringTable.set("Name", "이름");
        newLangSet.stringTable.set("Type", "타입");
        newLangSet.stringTable.set("Affects", "점수 계산식");
        newLangSet.stringTable.set("Point", "점수");
        newLangSet.stringTable.set("OK", "확인");
        newLangSet.stringTable.set("Show Record", "기록 보기");
        newLangSet.stringTable.set("Easy", "쉬움");
        newLangSet.stringTable.set("Normal", "보통");
        newLangSet.stringTable.set("Hard", "어려움");
        newLangSet.stringTable.set("Extreme", "극한");
        newLangSet.stringTable.set("Crazy", "미친 난이도");
        newLangSet.stringTable.set("Player", "플레이어");
        newLangSet.stringTable.set("AI", "AI");
        newLangSet.stringTable.set("Add", "추가");
        newLangSet.stringTable.set("Remove Last", "마지막 플레이어 삭제");
        newLangSet.stringTable.set("Difficulty", "난이도");
        newLangSet.stringTable.set("Concealed", "숨겨짐");
        newLangSet.stringTable.set("Please select your card first.", "보유한 카드에서 카드를 하나 선택해 주세요.");
        newLangSet.stringTable.set("7-Protected slot. Only the owner can pay here now.", "7 로 보호된 곳입니다. 마지막으로 7 카드가 놓인 곳에는 그 곳의 주인만 카드를 놓을 수 있습니다.");
        newLangSet.stringTable.set("The number, or the operation symbol should equal to the card [[LASTCARD]]", "마지막으로 놓인 카드([[LASTCARD]])와 숫자, 혹은 기호가 동일한 카드만 놓을 수 있습니다.");
        newLangSet.stringTable.set("Cannot pay multiple cards.", "여러 장의 카드를 동시에 놓을 수 없습니다.");
        newLangSet.stringTable.set("Pay the card '[[CARD]]' to the player '[[PLAYER]]'.", "'[[CARD]]' 카드를 플레이어 '[[PLAYER]]' 에게 제출함");
        newLangSet.stringTable.set("Get one card from deck.", "덱에서 카드를 한 장 받음");
        newLangSet.stringTable.set("Normal Mode", "기본 모드");
        newLangSet.stringTable.set("Speed Mode", "스피드 모드");
        newLangSet.stringTable.set("Multiplyless Mode", "× 없는 모드");
        newLangSet.stringTable.set("Plusless Mode", "＋ 없는 모드");
        newLangSet.stringTable.set("Each player will get 10 cards at the game starts.", "각 플레이어는 게임 시작 시 10장의 카드를 가지고 시작합니다.");
        newLangSet.stringTable.set("Each player will get 7 cards at the game starts. The number of card will be -1 to 5.", "각 플레이어는 게임 시작 시 7장의 카드를 가지고 시작합니다. 카드 숫자는 -1 에서 5까지만 등장합니다.");
        newLangSet.stringTable.set("There is no × card.", "×카드가 등장하지 않습니다.");
        newLangSet.stringTable.set("There is no ＋ card.", "＋카드가 등장하지 않습니다.");
        newLangSet.stringTable.set("paste custom AI script here if you want", "직접 AI 인공지능 처리 스크립트를 사용하려면 이 곳에 붙여 넣으세요.");
        newLangSet.stringTable.set("Record playing data", "플레이 기록하기");
        newLangSet.stringTable.set("Trying to record playing data includes all progress in the game.", "게임의 진행 과정을 모두 기록합니다. 결과 화면에서 이 데이터를 JSON 텍스트 형식으로 볼 수 있습니다.");
        newLangSet.stringTable.set("Show advanced features", "고급 기능 활성화");
        newLangSet.stringTable.set("Not recommended for beginners of using computer.", "컴퓨터 초보에게는 사용을 권장하지 않습니다.");
        newLangSet.stringTable.set("If you use this features, you can use custom AI scripts.", "이 기능을 사용하면 커스텀 AI 스크립트를 입력할 수 있게 됩니다.");
        newLangSet.stringTable.set("Please check your script for malware before using it.", "스크립트 사용 전 스크립트 내용에 악성코드가 있는지 꼭 확인해 주세요.");
        newLangSet.stringTable.set("Error", "오류");
        newLangSet.stringTable.set("Information", "안내");
        newLangSet.stringTable.set("Message", "메시지");
        newLangSet.stringTable.set("Tip", "팁");
        newLangSet.stringTable.set("Tutorial", "게임 배우기");
        newLangSet.stringTable.set("Tutorial Assistant", "튜토리얼 도우미");
        newLangSet.stringTable.set("Theme Script", "테마 스크립트");
        newLangSet.stringTable.set("You can paste the styling scripts here.", "이 곳에 테마 변경용 스크립트(JSON)를 입력할 수 있습니다.");
        newLangSet.stringTable.set("On this platform, local storage saving is not working. Changes will be applied only this time.", "이 플랫폼에서는 로컬 저장소 기능을 사용할 수 없습니다. 설정은 적용되지만 다음 번 실행 시 다시 초기화됩니다.");
        newLangSet.stringTable.set("Some custom player setting is not supported for recording replay.", "사용자 정의 플레이어 세팅으로 인해 리플레이 저장 기능이 동작하지 않습니다.");
        newLangSet.stringTable.set("Use virtual select box", "가상 리스트박스 사용");
        newLangSet.stringTable.set("Use virtual keyboard", "가상 키보드 사용");
        newLangSet.stringTable.set("Use virtual select boxes and virtual keyboards.", "가상 리스트박스 및 가상 키보드 사용 여부를 설정합니다.");
        newLangSet.stringTable.set("The game is preparing to start.", "게임 시작을 준비하고 있습니다.");
        newLangSet.stringTable.set("Game is started.", "게임이 시작되었습니다.");
        newLangSet.stringTable.set("Mode", "모드");
        newLangSet.stringTable.set("Cards is shuffled.", "카드를 섞었습니다.");
        newLangSet.stringTable.set("The first turn number is [[NUMBER]]", "첫 번째로 시작할 플레이어의 번호는 [[NUMBER]] 입니다.");
        newLangSet.stringTable.set("Your turn, [[PLAYER]].", "[[PLAYER]] 의 차례입니다.");
        newLangSet.stringTable.set("Turn [[TURN]], [[PLAYER]].", "[[TURN]]번째 턴, [[PLAYER]] 차례입니다.");
        newLangSet.stringTable.set("Game is finished.", "게임이 끝났습니다.");
        newLangSet.stringTable.set("See replay code", "리플레이 코드 보기");
        newLangSet.stringTable.set("Debug mode was activated.", "디버그 모드 활성화됨");
        newLangSet.stringTable.set("Please add player to play.", "게임 시작 전 플레이어를 추가해 주세요.");
        newLangSet.stringTable.set("Please select correct player type.", "올바른 플레이어 타입을 선택해 주세요.");
        newLangSet.stringTable.set("Try this first to learn about this game.", "게임을 배우기 위해 이 모드를 처음 플레이해 보세요.");
        newLangSet.stringTable.set("How to play", "게임 방법");
        newLangSet.stringTable.set("Some features will be applied after restart.", "일부 기능은 재시작 후 적용됩니다.");
        newLangSet.stringTable.set("The user stop the game.", "사용자가 게임을 중단시켰습니다.");
        newLangSet.stringTable.set("The player [[PLAYER]] does not have any card.", "플레이어 '[[PLAYER]]' 이/가 보유한 카드가 없습니다.");
        newLangSet.stringTable.set("The deck is empty.", "덱에 카드가 없습니다.");
        newLangSet.stringTable.set("The player '[[PLAYER]]' take a card from the deck.", "플레이어 '[[PLAYER]]' 가 덱에서 카드를 가져갑니다.");
        newLangSet.stringTable.set("The player '[[PLAYER]]' pay '[[CARD]]' to the player '[[TARGET]]'.", "플레이어 '[[PLAYER]]' 가 '[[CARD]]' 카드를 플레이어 '[[TARGET]]' 에게 제출합니다.");
        newLangSet.stringTable.set("Please input the replay code first.", "리플레이 코드를 먼저 삽입해 주세요.");
        newLangSet.stringTable.set("There must be at least two players, and there is no maximum limit, but it is recommended that four players play. Support play with simple AI computer.", "플레이어는 최소 2명 이상이어야 하고, 최대 제한은 없지만 4명이서 플레이하는 것을 권장합니다.\n인공지능 컴퓨터와의 플레이를 지원합니다.");
        newLangSet.stringTable.set("This game is a turn-based card game.", "이 게임은 턴제 카드 게임입니다.");
        newLangSet.stringTable.set("The cards used in this game are represented by numbers between -1 and 10, and three symbols (＋－×); As such, there are 33 different types of cards in a set of cards.", "이 게임에서 사용하는 카드는, -1 ~ 10 사이의 숫자와,\n＋－× 3가지 기호 중 각 하나씩이 그려져 있습니다.\n이와 같이, 카드 1세트에는 33가지 다른 종류의 카드가 있습니다.");
        newLangSet.stringTable.set("The game uses as many sets of cards as there are players. For example, if two people play the game, the game will be played with 66 cards.", "게임에서는 플레이어 수 만큼의 세트의 카드들을 사용합니다.\n예를 들어, 2명의 플레이어가 있다면 66장의 카드로 게임을 진행합니다.");
        newLangSet.stringTable.set("When the game starts, each player receives 10 cards after shuffling. Place the remaining cards invisible on the 'deck'.", "게임이 시작되면, 카드를 섞은 후 각 플레이어는 카드를 10장씩 받습니다.\n남은 카드는 '덱'에 보이지 않게 놓습니다.");
        newLangSet.stringTable.set("The player will not see the opponent's card.", "플레이어는 자신이 받은 카드를 상대방이 보이지 않도록 합니다.");
        newLangSet.stringTable.set("When you are on your turn, the player either takes a card from the deck, or You must place one card of your own card in place of another player. Cards placed are not available and must be placed for viewing by anyone.", "자신의 차례가 되면, 플레이어는 덱에서 카드를 한 장 받거나,\n또는 받은 자신의 카드 한 장을 다른 플레이어의 자리에 카드를 놓아야 합니다.\n자리에 놓인 카드는 게임이 끝날 때까지 누구도 사용이 불가능하며, 누구나 볼 수 있도록 놓아야 합니다.");
        newLangSet.stringTable.set("If there is already a card in the player's seat, no cards can be placed there. Only cards with the same number of symbols or symbols at the end can be 'placed'. However, a card with a number of 1 can be placed in a different number or symbol.", "플레이어의 자리에 이미 놓인 카드가 있다면, 그 곳에 아무 카드나 놓을 수 없습니다.\n마지막에 놓인 카드의 숫자, 혹은 기호가 동일한 카드만 놓을 수 있습니다.\n단, 숫자가 1인 카드는 예외적으로 숫자나 기호가 다른 자리에 놓을 수 있습니다.");
        newLangSet.stringTable.set("If the number of the last card 'placed' is 7, only the owner of the place can place another card.", "마지막에 놓인 카드의 숫자가 7인 자리에는 그 자리의 주인만 카드를 놓을 수 있습니다.");
        newLangSet.stringTable.set("If there is no card on deck, or someone who doesn't have any card, the game ends and scores should be calculated.", "덱에 카드가 한 장도 없거나, 받은 카드를 모두 소진한 플레이어가 1명이라도 있다면\n게임이 끝나고 점수를 계산합니다.");
        newLangSet.stringTable.set("The score is calculated as a mathematical operation of the cards 'placed' for the player. If there are no cards left, it is 0. Calculations are performed in order, regardless of operator.", "점수는 플레이어의 자리에 놓인 카드들을 순서대로 수학 연산하듯이 계산됩니다.\n계산할 때, 맨 앞에 숫자 0인 카드가 있다고 가정합니다.\n계산 순서는 연산자와 상관없이 순서대로 진행합니다.\n(곱셈이 섞여있어도 무조건 순서대로 계산)");
        newLangSet.stringTable.set("Player 'A' 's 'placed' cards : [＋5][－5][－6][－6][＋4][×4] Point calculation : (0 ＋ 5 － 5 － 6 － 6 ＋4) × 4 = －32", "플레이어 A의 자리에 [＋5][－5][－6][－6][＋4][×4] 가 순서대로 놓여 있으면\n점수 계산식은 (0 ＋ 5 － 5 － 6 － 6 ＋4) × 4 = －32");
        newLangSet.stringTable.set("The player with the highest score wins.", "점수가 가장 높은 플레이어가 승리합니다.");
        newLangSet.stringTable.set("Please visit [[URL]] to get more.", "[[URL]] 에 방문해 주세요.\n게임의 주요 소스코드가 공개되어 있습니다.");
        newLangSet.stringTable.set("Copy and save following codes and paste on the replay player to see progress again.", "아래의 코드를 복사해 저장해 두세요. 리플레이 플레이어에 붙여넣어 리플레이 재생이 가능합니다.");
        hjow_languageSets.push(newLangSet);
    };
};

class XCalcReplayEngine extends XCalcGameEngine {
    protected recordedDate: Date = null;
    protected actions: XCalcReplayAction[] = [];
    protected lastMessage: string = "";
    public constructor(plcArea: string = '.hjow_xcalc_style_place', additionalRefreshFunction: Function = null, debugMode: boolean = false) {
        super(plcArea, additionalRefreshFunction, debugMode);
        this.name = "X Card Replay Player";
        this.desc = "X Card Replay Play Engine";
    };
    protected mainPageHTML(): string {
        var results: string = "";
        results += "<table class='element e001 full layout'>" + "\n";
        results += "  <tr class='element e002'>" + "\n";
        results += "     <td class='element e003 td_game_title'>" + "\n";
        results += "        <h2 class='element e004'>" + hjow_serializeXMLString(hjow_trans("X Card")) + "</h2>" + "\n";
        results += "     </td>" + "\n";
        results += "  </tr>" + "\n";
        results += "  <tr class='element e005'>" + "\n";
        results += "     <td class='element e006 td_player_list'>" + "\n";

        results += "     </td>" + "\n";
        results += "  </tr>" + "\n";
        results += "  <tr class='element e006'>" + "\n";
        results += "     <td class='element e007 td_game_start' style='height: 25px;'>" + "\n";
        results += "        <button type='button' class='element e009 btn_game_start'>" + hjow_serializeXMLString(hjow_trans("Start Replay")) + "</button>" + "\n";
        results += "     </td>" + "\n";
        results += "  </tr>" + "\n";
        results += "</table>" + "\n";
        return results;
    };
    protected refreshMain() {
        jq(this.placeArea).find('.td_player_list').empty();
        var results = "<textarea class='full tx_replay_code'></textarea>";
        
        jq(this.placeArea).find('.td_player_list').html(hjow_toStaticHTML(results));
        
        this.initTheme(1, false);
        this.refreshMainGameMode(true);
        
        // jq(this.placeArea).find('.tx_replay_code').val(JSON.stringify(sampleReplay));
    };
    protected toolbarHTML(): string {
        var results: string = "";
        results += "<div class='element e127 toolbar_element left toolbar_buttons'>";
        if (this.gameStarted) {
            results += "<button type='button' class='element e128 btn_stop_game'>" + hjow_serializeXMLString(hjow_trans("Stop Replay")) + "</button> ";
        } else if (this.showSettings) {
            results += "<button type='button' class='element e130 btn_go_main'>" + hjow_serializeXMLString(hjow_trans("Go back to main")) + "</button> ";
        }
        results += "   <button type='button' class='element e131 btn_show_log'> " + hjow_serializeXMLString(hjow_trans("Show Log")) + "</button>";
        results += "   <button type='button' class='element e132 btn_delete_log'>" + hjow_serializeXMLString(hjow_trans("Delete Log")) + "</button>";

        var platformInfo = hjow_getPlatform();
        if (!(platformInfo == 'ios' || platformInfo == 'browser'))
            results += "   <button type='button' class='element e132 btn_exit'>" + hjow_serializeXMLString(hjow_trans("Exit")) + "</button>";
        results += "</div>";
        results += "<div class='element e133 toolbar_element'>";
        results += "<span class='element e134 madeby'>Made by HJOW (hujinone22@naver.com)</span>";
        results += "</div>";

        results += "<div class='element e135 toolbar_element right'>";
        results += "<span class='element e136 version'>v" + this.version + "</span>";
        results += "</div>";

        return results;
    };
    protected getThisTurnAction(): XCalcReplayAction {
        return this.actions[this.turnNumber];
    };
    protected getLastTurnAction(): XCalcReplayAction {
        if (this.turnNumber == 0) return null;
        return this.actions[this.turnNumber - 1];
    };
    protected prepareEvents() {
        super.prepareEvents();
        var selfObj: XCalcReplayEngine = this; // 부모 클래스로 타입을 지정하면 아래쪽에서 부모 클래스의 멤버변수에 액세스가 안 됨...
        var selfAny: any = this.getSelfObject(); // 이렇게 안하면 타입스크립트 제한사항 때문에 메소드 부여가 안 됨...
        selfAny.events.game.btn_next = function () {
            var actionPlayer = selfObj.turnPlayerIndex;
            selfObj.turnPlayerIndex++;
            selfObj.turnNumber++;
            if (selfObj.turnPlayerIndex >= selfObj.players.length) {
                selfObj.turnPlayerIndex = 0;
            }
            if (selfObj.turnNumber >= selfObj.actions.length) {
                selfObj.turnNumber = selfObj.actions.length - 1;
                selfObj.showResult = true;
                selfObj.gameStarted = false;
            }
            jq(selfObj.placeArea).find('.page_game .btn_next').hide();
            selfObj.onTurnChangedBefore(actionPlayer);
            if (selfObj.showResult) {
                selfObj.refreshPage();
            } else {
                selfObj.refreshPage(false);
                selfObj.onTurnChangedAfter();
            }
        };
    };
    protected onTurnChangedBefore(focusPlayerIndex: number) {
        var action: XCalcReplayAction = this.getLastTurnAction();
        var player: XCalcPlayer = this.players[focusPlayerIndex];
        if (action.payTargetPlayerIndex < 0 || action.card == null) {
            var deckCard = this.deck[0];
            hjow_removeItemFromArray(this.deck, 0);
            player.addOneOnInventory(deckCard, this);
        } else {
            var targetPlayer: XCalcPlayer = this.players[action.payTargetPlayerIndex];
            targetPlayer.pay(action.card, player);
        }
    };
    protected onTurnChangedAfter() {
        hjow_log(hjow_replaceStr(hjow_replaceStr(hjow_trans("Turn [[TURN]], [[PLAYER]]."), "[[PLAYER]]", this.getPlayerNowTurn().getName()), "[[TURN]]", String((this.turnNumber + 1))));
        var action: XCalcReplayAction = this.getThisTurnAction();
        if (action.payTargetPlayerIndex < 0 || action.card == null) {
            hjow_log(hjow_replaceStr(hjow_trans("The player '[[PLAYER]]' take a card from the deck."), "[[PLAYER]]", this.players[action.actionPlayerIndex].getName()));
        } else {
            this.lastMessage = hjow_replaceStr(hjow_replaceStr(hjow_replaceStr(hjow_trans("The player '[[PLAYER]]' pay '[[CARD]]' to the player '[[TARGET]]'."), "[[PLAYER]]", this.players[action.actionPlayerIndex].getName()), "[[CARD]]", action.card.toString()), "[[TARGET]]", this.players[action.payTargetPlayerIndex].getName());
            hjow_log(this.lastMessage);
        }
    };
    protected refreshEvents() {
        super.refreshEvents();
        var selfObj = this;
        var selfAny: any = this.getSelfObject();
        var pageArea = jq(this.placeArea);
        this.reAllocateButtonEvent(pageArea.find('.btn_next'), function (compObj) {
            selfAny.events.game.btn_next();
        });
    };

    public startGame() {
        try {
            var jsonContent = jq(this.placeArea).find('.tx_replay_code').val();
            if (jsonContent == null || jsonContent.trim() == '') {
                hjow_alert(hjow_trans("Please input the replay code first."));
                return;
            }

            var jsonObj = JSON.parse(jsonContent);
            this.replay = null;
            this.resultReason = '';
            this.recordedDate = hjow_string_to_date(jsonObj.date);
            this.deck = [];
            for (var ddx = 0; ddx < jsonObj.deck.length; ddx++) {
                var newCard: XCalc = new XCalc();
                newCard.op = jsonObj.deck[ddx].op;
                newCard.no = jsonObj.deck[ddx].no;
                newCard.setUniqueId(this, jsonObj.deck[ddx].uniqueId);
                this.deck.push(newCard);
            }

            this.players = [];
            for (var pdx = 0; pdx < jsonObj.players.length; pdx++) {
                var playerOneObj = jsonObj.players[pdx];
                var newPlayer: XCalcPlayer = null;
                for (var ptdx = 0; ptdx < this.playerTypes.length; ptdx++) {
                    if (this.playerTypes[ptdx].getSupportPlayerClassName() == playerOneObj.type) {
                        newPlayer = this.playerTypes[ptdx].restoreFromPlainObject(playerOneObj, this);
                        break;
                    }
                }
                if (newPlayer == null) throw "Some player type is not supported." + playerOneObj.type;
                this.players.push(newPlayer);
            }

            this.gameModeIndex = -1;
            for (var gtdx = 0; gtdx < this.gameModeList.length; gtdx++) {
                if (this.gameModeList[gtdx].getClassName() == jsonObj.gameMode) {
                    this.gameModeIndex = gtdx;
                    break;
                }
            }

            if (this.gameModeIndex < 0) throw "The game mode is not supported.";
            this.debugMode = jsonObj.debugModeUsed;

            this.turnNumber = 0;
            this.turnPlayerIndex = 0;
            this.actions = [];
            for (var adx = 0; adx < jsonObj.actions.length; adx++) {
                var actionObj = jsonObj.actions[adx];
                var actionOne: XCalcReplayAction = new XCalcReplayAction();

                if (actionObj.card == null) {
                    actionOne.card = null;
                } else {
                    var targetCard: XCalc = new XCalc();
                    targetCard.op = actionObj.card.op;
                    targetCard.no = actionObj.card.no;
                    targetCard.setUniqueId(this, actionObj.card.uniqueId);
                    actionOne.card = targetCard;
                }

                actionOne.date = hjow_string_to_date(actionObj.date);
                actionOne.payTargetPlayerIndex = actionObj.payTargetPlayerIndex;
                actionOne.actionPlayerIndex = actionObj.actionPlayerIndex;

                this.actions.push(actionOne);
            }
            if (this.actions.length >= 1) {
                this.turnPlayerIndex = this.actions[0].actionPlayerIndex;
            }
            this.resultReason = jsonObj.reason;

        } catch (e) {
            hjow_error(e, true);
            return;
        }
        
        hjow_log(hjow_trans("The game is preparing to start."));
        this.lastMessage = "";
        this.gameStarted = true;
        this.refreshPage();

        if (this.isDebugMode()) hjow_log(hjow_trans("Debug mode was activated."));
        this.onTurnChangedAfter();
        
        this.actPlayerTurnStopRequest = false;
        this.actPlayerTurnRequest = false;
        jq(this.placeArea).find('.page_game .btn_next').show();
    };
    protected refreshGameAfterTime() {
        super.refreshGameAfterTime();
        var gameArea = jq(this.placeArea).find('.page_game');

        gameArea.find('.selalter_option.concealed').hide();
        gameArea.find('.selalter_option:not(.concealed)').show();
        gameArea.find('.selalter_option').removeClass('selected');
        gameArea.find('select.inventory').val(null);

        var currentPlayer: XCalcPlayer = this.getPlayerNowTurn();
        var action: XCalcReplayAction = this.getThisTurnAction();

        var curPlayerSel = gameArea.find('.pplace_' + currentPlayer.getUniqueId());
        var invSel = curPlayerSel.find('select.inventory');

        if (action.card != null) {
            var selectedList: string[] = [];
            selectedList.push(action.card.getUniqueId());
            invSel.val(selectedList);
            if (invSel != null) {
                var invSelAlt = curPlayerSel.find('.selalter.div_' + invSel.attr('data-selalt'));
                invSelAlt.find('.selalter_option').each(function () {
                    var altOpt = jq(this);
                    if (altOpt.attr('data-value') == action.card.getUniqueId()) {
                        altOpt.addClass('selected');
                    }
                });
            }
        }
        this.refreshEvents();
        hjow_setProgressValue('.prog_game_status_bar', 1, "[" + (this.turnNumber + 1) + "/" + this.actions.length + "] " + this.lastMessage);
        if (this.gameStarted) {
            jq(this.placeArea).find('.page_game .btn_next').show();
        }
    };
    public refreshPage(heavyRefresh: boolean = true) {
        super.refreshPage(heavyRefresh);
        var gameArea = jq(this.placeArea).find('.page_game');
        gameArea.find(".btn_get_from_deck").remove();
        gameArea.find(".btn_pay_here").remove();

        gameArea.find('option.concealed').hide();
        gameArea.find('option:not(.concealed)').show();

        if (this.gameStarted) {
            var deckArea = gameArea.find('.td_deck');
            deckArea.find('button').remove();
            deckArea.append("<button type='button' class='element btn_user_control btn_next hidden'>→</button>");
        }
    };
};

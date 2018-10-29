import { Directive, Input, ElementRef, SimpleChanges, Inject } from '@angular/core';
import "pascalprecht.translate";
import { ObjectUtils } from "../utils/object-utils";

@Directive({
    selector: '[kylo-timer]'
})
export class KyloTimerDirective {

    @Input() startTime: any;
    @Input() truncatedFormat: any;
    @Input() addAgoSuffix: any;

    refreshTime: any;
    time: any;
    previousDisplayStr: any;
    interval: any;

    clearInterval(): void {
        clearInterval(this.interval);
        this.interval = null;
    }

    ngOnDestroy(): void {
        this.clearInterval();
    }

    update () {
        this.time += this.refreshTime;
        //format it
        this.format();
    }

    format(): void {
        var ms = this.time;
        var displayStr = DateTimeUtils(this.$injector.get("$filter")('translate')).formatMillisAsText(ms, this.truncatedFormat, false);
        if (this.addAgoSuffix) {
            displayStr += " ago";
        }

        if (this.previousDisplayStr == '' || this.previousDisplayStr != displayStr) {
            $(this.elRef.nativeElement).html(displayStr);
            $(this.elRef.nativeElement).attr('title', displayStr);
        }
        this.previousDisplayStr = displayStr;

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.startTime.firstChange) {
            console.log(changes.startTime);
            this.time = changes.startTime.currentValue;
            this.format();
        }
    }

    ngOnInit(): void {
        this.truncatedFormat = ObjectUtils.isDefined(this.truncatedFormat) ? this.truncatedFormat : false;
        this.addAgoSuffix = ObjectUtils.isDefined(this.addAgoSuffix) ? this.addAgoSuffix : false;

        this.time = this.startTime;
        this.previousDisplayStr = '';

        this.format();

        if (this.refreshTime == undefined) {
            this.refreshTime = 1000;
        }

        this.interval = setInterval(() => {this.update()}, this.refreshTime);

    }
    constructor(private elRef: ElementRef,
        @Inject("$injector") private $injector: any) { }
}


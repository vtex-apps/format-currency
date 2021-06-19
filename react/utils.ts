import CustomFormat from "./typings/CustomFormat";

const defaultProps: CustomFormat = {
    decimalSeparator: '.',
    thousandsGroupStyle: 'thousand',
    fixedDecimalScale: true,
    prefix: '$',
    suffix: '',
    allowNegative: true,
    allowEmptyFormatting: true,
    allowLeadingZeros: false,
    isNumericString: true,
    type: 'text',
    decimalScale: 2,
    format: '',
    thousandSeparator: true,
    allowedDecimalSeparators: ['', ',']
};

export default class Format {
    props: CustomFormat;
    constructor(props: CustomFormat = defaultProps) {
        this.props = { ...defaultProps, ...props }
    }

    public currency = (value: string) => {
        const { thousandSeparator, decimalSeparator } = this.getSeparators();

        const hasDecimalSeparator = value.indexOf('.') !== -1 || (this.props.decimalScale && this.props.fixedDecimalScale);
        let { beforeDecimal, afterDecimal, addNegation } = this.splitDecimal(value, this.props.allowNegative);

        //apply decimal precision if its defined
        if (this.props.decimalScale !== undefined) {
            afterDecimal = this.limitToScale(afterDecimal, this.props.decimalScale ?? 2, this.props.fixedDecimalScale);
        }

        if (thousandSeparator) {
            beforeDecimal = this.applyThousandSeparator(beforeDecimal, thousandSeparator, this.props.thousandsGroupStyle);
        }

        //add prefix and suffix
        if (this.props.prefix) beforeDecimal = this.props.prefix + beforeDecimal;
        if (this.props.suffix) afterDecimal = afterDecimal + this.props.suffix;

        //restore negation sign
        if (addNegation) beforeDecimal = '-' + beforeDecimal;

        value = beforeDecimal + ((hasDecimalSeparator && decimalSeparator) || '') + afterDecimal;

        return value;
    }

    private getSeparators = () => {
        const { decimalSeparator } = this.props;
        let { thousandSeparator, allowedDecimalSeparators } = this.props;

        if (thousandSeparator === true) {
            thousandSeparator = ',';
        }
        if (!allowedDecimalSeparators) {
            allowedDecimalSeparators = [decimalSeparator, '.'];
        }

        return {
            decimalSeparator,
            thousandSeparator,
            allowedDecimalSeparators,
        };
    }

    private splitDecimal = (numStr: string, allowNegative: boolean = true) => {
        const hasNagation = numStr[0] === '-';
        const addNegation = hasNagation && allowNegative;
        numStr = numStr.replace('-', '');

        const parts = numStr.split('.');
        const beforeDecimal = parts[0];
        const afterDecimal = parts[1] || '';

        return {
            beforeDecimal,
            afterDecimal,
            hasNagation,
            addNegation,
        };
    }

    private limitToScale = (numStr: string, scale: number, fixedDecimalScale?: boolean) => {
        let str = '';
        const filler = fixedDecimalScale ? '0' : '';
        for (let i = 0; i <= scale - 1; i++) {
            str += numStr[i] || filler;
        }
        return str;
    }

    private applyThousandSeparator = (
        str: string,
        thousandSeparator: string,
        thousandsGroupStyle?: string,
    ) => {
        const thousandsGroupRegex = this.getThousandsGroupRegex(thousandsGroupStyle);
        let index = str.search(/[1-9]/);
        index = index === -1 ? str.length : index;
        return (
            str.substring(0, index) +
            str.substring(index, str.length).replace(thousandsGroupRegex, '$1' + thousandSeparator)
        );
    }

    private getThousandsGroupRegex = (thousandsGroupStyle?: string) => {
        switch (thousandsGroupStyle) {
            case 'lakh':
                return /(\d+?)(?=(\d\d)+(\d)(?!\d))(\.\d+)?/g;
            case 'wan':
                return /(\d)(?=(\d{4})+(?!\d))/g;
            case 'thousand':
            default:
                return /(\d)(?=(\d{3})+(?!\d))/g;
        }
    }
}
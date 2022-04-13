import { isEmpty } from 'lodash';
import { mapState, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';

const handlerAaveOverlay = {
  props: {
    isLoadingData: {
      type: Boolean,
      default: true
    },
    userSummary: {
      type: Object,
      default: () => {}
    },
    reservesData: {
      type: Array,
      default: () => []
    },
    preSelectedToken: {
      default: () => {
        return {};
      },
      type: Object
    },
    open: {
      default: false,
      type: Boolean
    },
    close: {
      default: () => {},
      type: Function
    }
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapGetters('external', ['fiatValue']),
    actualSelectedToken() {
      const selectedTokens = isEmpty(this.selectedToken)
        ? isEmpty(this.preSelectedToken)
          ? {}
          : this.preSelectedToken
        : this.selectedToken;
      return selectedTokens;
    },
    actualToken() {
      return this.reservesData.find(item => {
        if (item.symbol === this.actualSelectedToken.token) return item;
      });
    },
    selectedTokenUSDValue() {
      return new BigNumber(this.actualToken?.price?.priceInEth || 0).times(
        this.fiatValue
      );
    },
    selectedTokenInUserSummary() {
      return this.userSummary?.reservesData?.find(item => {
        if (item.reserve.symbol === this.actualSelectedToken.token) {
          return item;
        }
      });
    },
    amountUsd() {
      const amount = this.amount ? this.amount : 0;

      return `$
        ${
          formatFiatValue(BigNumber(this.selectedTokenUSDValue).times(amount))
            .value
        }`;
    }
  }
};

export default handlerAaveOverlay;

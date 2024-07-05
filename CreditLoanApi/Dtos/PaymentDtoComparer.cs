using CreditLoan.Dtos;

namespace CreditLoanApi.Dtos
{
    class PaymentDtoComparer : IEqualityComparer<PaymentDto>
    {
        public bool Equals(PaymentDto x, PaymentDto y)
        {
            if (x.PaymentId.ToLower() == y.PaymentId.ToLower()
                    && x.CustomerId == y.CustomerId)
                return true;

            return false;
        }

        public int GetHashCode(PaymentDto obj)
        {
            return obj.CustomerId.GetHashCode();
        }
    }
}

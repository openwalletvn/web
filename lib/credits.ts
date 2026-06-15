export const CREDIT_CONVERSION = {
    input_tokens_per_credit: 4000,
    output_tokens_per_credit: 1000,
}

export function tokensToCreditCost(input: number, output: number): number {
    return input / CREDIT_CONVERSION.input_tokens_per_credit
        + output / CREDIT_CONVERSION.output_tokens_per_credit
}

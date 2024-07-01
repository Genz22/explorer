import type { RequestRegistry } from '@/libs/registry'
// import dayjs from 'dayjs'
import { adapter } from '@/libs/registry'
import type { GovProposal, PaginatedProposals } from '@/types'

// which registry is store
export const store = 'name' // name or version
// Blockchain Name
export const name = 'initia'

function proposalAdapter(p: any): GovProposal {
    if (p) {
        if (p.messages && p.messages.length >= 1) p.content = p.messages[0].content || p.messages[0]
        p.proposal_id = p.id
        p.final_tally_result = {
            yes: p.final_tally_result?.yes_count,
            no: p.final_tally_result?.no_count,
            no_with_veto: p.final_tally_result?.no_with_veto_count,
            abstain: p.final_tally_result?.abstain_count,
        }
    }
    return p
}

// initia custom request
export const requests: Partial<RequestRegistry> = {
    auth_accounts: { url: '/cosmos/auth/v1beta1/accounts', adapter },
    auth_account_address: {
        url: '/cosmos/auth/v1beta1/accounts/{address}',
        adapter,
    },
    params: { url: '/cosmos/params/v1beta1/params?subspace={subspace}&key={key}', adapter },
    bank_params: { url: '/cosmos/bank/v1beta1/params', adapter },
    bank_balances_address: {
        url: '/cosmos/bank/v1beta1/balances/{address}',
        adapter,
    },
    bank_supply_by_denom: { url: '/cosmos/bank/v1beta1/supply/by_denom?denom={denom}', adapter },
    distribution_params: { url: '/initia/distribution/v1/params', adapter },
    distribution_validator_commission: {
        url: '/initia/distribution/v1/validators/{validator_address}/commission',
        adapter,
    },
    distribution_validator_outstanding_rewards: {
        url: '/initia/distribution/v1/validators/{validator_address}/outstanding_rewards',
        adapter,
    },
    distribution_validator_slashes: {
        url: '/initia/distribution/v1/validators/{validator_address}/slashes',
        adapter,
    },
    distribution_delegator_rewards: {
        url: '/initia/distribution/v1/delegators/{delegator_addr}/rewards',
        adapter,
    },
    slashing_params: { url: '/cosmos/slashing/v1beta1/params', adapter },
    slashing_signing_info: {
        url: '/cosmos/slashing/v1beta1/signing_infos',
        adapter,
    },
    gov_params_voting: { url: '/initia/gov/v1/params/voting', adapter },
    gov_params_tally: { url: '/initia/gov/v1/params/tallying', adapter },
    gov_params_deposit: { url: '/initia/gov/v1/params/deposit', adapter },
    gov_proposals: {
        url: '/initia/gov/v1/proposals', adapter: (source: any): PaginatedProposals => {
            const proposals = source.proposals.map((p: any) => proposalAdapter(p))
            return {
                proposals,
                pagination: source.pagination
            }
        }
    },
    gov_proposals_proposal_id: {
        url: '/initia/gov/v1/proposals/{proposal_id}',
        adapter: (source: any): { proposal: GovProposal } => {
            return {
                proposal: proposalAdapter(source.proposal)
            }
        },
    },
    gov_proposals_deposits: {
        url: '/initia/gov/v1/proposals/{proposal_id}/deposits',
        adapter,
    },
    gov_proposals_tally: {
        url: '/initia/gov/v1/proposals/{proposal_id}/tally',
        adapter,
    },
    gov_proposals_votes: {
        url: '/initia/gov/v1/proposals/{proposal_id}/votes',
        adapter,
    },
    gov_proposals_votes_voter: {
        url: '/initia/gov/v1/proposals/{proposal_id}/votes/{voter}',
        adapter,
    },
    staking_deletations: {
        url: '/initia/mstaking/v1/delegations/{delegator_addr}',
        adapter,
    },
    staking_delegator_redelegations: {
        url: '/initia/mstaking/v1/delegators/{delegator_addr}/redelegations',
        adapter,
    },
    staking_delegator_unbonding_delegations: {
        url: '/initia/mstaking/v1/delegators/{delegator_addr}/unbonding_delegations',
        adapter,
    },
    staking_delegator_validators: {
        url: '/initia/mstaking/v1/delegators/{delegator_addr}/validators',
        adapter,
    },
    staking_params: { url: '/initia/mstaking/v1/params', adapter },
    staking_pool: { url: '/initia/mstaking/v1/pool', adapter },
    staking_validators: {
        url: '/initia/mstaking/v1/validators?pagination.limit={limit}&status={status}',
        adapter,
    },
    staking_validators_address: {
        url: '/initia/mstaking/v1/validators/{validator_addr}',
        adapter,
    },
    staking_validators_delegations: {
        url: '/initia/mstaking/v1/validators/{validator_addr}/delegations',
        adapter,
    },
    staking_validators_delegations_delegator: {
        url: '/initia/mstaking/v1/validators/{validator_addr}/delegations/{delegator_addr}',
        adapter,
    },
    staking_validators_delegations_unbonding_delegations: {
        url: '/initia/mstaking/v1/validators/{validator_addr}/delegations/{delegator_addr}/unbonding_delegation',
        adapter,
    },
    base_tendermint_abci_query: {
      url: '/cosmos/base/tendermint/v1beta1/abci_query',
      adapter,
    },
    tx_txs: { url: '/cosmos/tx/v1beta1/txs', adapter },
    tx_txs_block: { url: '/cosmos/tx/v1beta1/txs/block/{height}', adapter },
    tx_hash: { url: '/cosmos/tx/v1beta1/txs/{hash}', adapter },
  
    mint_inflation: { url: '', adapter },
    mint_params: { url: '/initia/reward/v1/params', adapter },
    mint_annual_provisions: {
      url: '/initia/reward/v1/annual_provisions',
      adapter,
    }
}

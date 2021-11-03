import React, { useState } from 'react'
import {
  PageWrapper,
  ResponsiveButtonPrimary,
  ResponsiveButtonOutline,
  ButtonRow,
  FirstWrapper,
  StyledMenuIcon,
  PanelWrapper,
  InfoWrapper,
  CircleIcon,
  ProcessWrapper,
  ArrowRight,
  EmptyProposals
} from './styleds'
import { Pair } from '@pangolindex/sdk'
import { useParams } from 'react-router-dom'
import { useActiveWeb3React } from '../../hooks'
import { Dots } from '../../components/swap/styleds'
import { Text, Box } from '@pangolindex/components'
import StatCard from '../../components/StatCard'
import MigrationCard from '../../components/MigrationCard'
import { useTranslation } from 'react-i18next'
import MigrationModal from '../../components/MigrationModal'
import { useMigrationModalToggle } from '../../state/application/hooks'
import { useGetMigrationData } from '../../state/migrate/hooks'
import { StakingInfo } from '../../state/stake/hooks'

export default function Migrate() {
  const below1080 = false
  const { t } = useTranslation()
  const params: any = useParams()
  const [selectedPool, setSelectedPool] = useState({} as { [address: string]: { pair: Pair; staking: StakingInfo } })

  const { account } = useActiveWeb3React()
  const toggleMigrationModal = useMigrationModalToggle()

  const { allPool, v2IsLoading, allV2PairsWithLiquidity } = useGetMigrationData(params?.version)

  return (
    <PageWrapper>
      <FirstWrapper>
        <Text color="text1" fontSize={48} mb={20} fontWeight="900">
          {t('migratePage.moveYourTokensToNewContracts')}
        </Text>
        <Text color="text1" fontSize={24} mb={20}>
          {t('migratePage.migrateWithDescription')}
        </Text>

        <ButtonRow>
          <ResponsiveButtonPrimary
            variant="primary"
            onClick={() => {
              setSelectedPool(null as any)
              toggleMigrationModal()
            }}
            isDisabled={Object.keys(allPool)?.length === 0}
          >
            {t('migratePage.migrateNow')}
          </ResponsiveButtonPrimary>
          <ResponsiveButtonOutline variant="outline">{t('migratePage.learn')}</ResponsiveButtonOutline>
        </ButtonRow>
      </FirstWrapper>

      <PanelWrapper style={{ marginTop: below1080 ? '0' : '50px' }}>
        <StatCard icon={<StyledMenuIcon />} title={t('migratePage.alreadyMigrate')} stat={`250.000.000$`} />

        <StatCard icon={<StyledMenuIcon />} title={t('migratePage.walletMigrate')} stat={`2.435`} />

        <StatCard icon={<StyledMenuIcon />} title={t('migratePage.alreadyEarned')} stat={`150.000$`} />
      </PanelWrapper>

      <InfoWrapper>
        <Box>
          <Text color="text1" fontSize={48} mb={10} fontWeight="900">
            {t('migratePage.migrateWithEase')}
          </Text>
          <Text color="text1" fontSize={24}>
            {t('migratePage.migrateWithDescription')}
          </Text>
        </Box>
        <ProcessWrapper>
          <Box display="inline-block">
            <CircleIcon>
              <StyledMenuIcon />
            </CircleIcon>
            <Text color="text1" fontSize={24} mt={10}>
              {t('migratePage.unstake')}
            </Text>
          </Box>

          <ArrowRight />

          <Box display="inline-block">
            <CircleIcon>
              <StyledMenuIcon />
            </CircleIcon>
            <Text color="text1" fontSize={24} mt={10}>
              {t('migratePage.remove')}
            </Text>
          </Box>

          <ArrowRight />
          <Box display="inline-block">
            <CircleIcon>
              <StyledMenuIcon />
            </CircleIcon>
            <Text color="text1" fontSize={24} mt={10}>
              {t('migratePage.add')}
            </Text>
          </Box>
          <ArrowRight />
          <Box display="inline-block">
            <CircleIcon>
              <StyledMenuIcon />
            </CircleIcon>
            <Text color="text1" fontSize={24} mt={10}>
              {t('migratePage.stake')}
            </Text>
          </Box>
        </ProcessWrapper>
      </InfoWrapper>

      <Box mt={50}>
        <Box textAlign="center">
          <Text color="text1" fontSize={48} mb={10} fontWeight="900">
            {t('migratePage.startMigratingNow')}
          </Text>
          <Text color="text1" fontSize={24}>
            {t('migratePage.startMigratingNowDescription')}
          </Text>
        </Box>

        {!account ? (
          <Box padding="40px">
            <Text color="text3" textAlign="center" fontSize={24}>
              {t('pool.connectWalletToView')}
            </Text>
          </Box>
        ) : v2IsLoading ? (
          <EmptyProposals>
            <Text color="text3" textAlign="center" fontSize={24}>
              <Dots>{t('pool.loading')}</Dots>
            </Text>
          </EmptyProposals>
        ) : allV2PairsWithLiquidity?.length > 0 ? (
          <PanelWrapper style={{ marginTop: below1080 ? '0' : '50px' }}>
            {Object.values(allPool).map(pool => (
              <MigrationCard
                key={pool?.pair?.liquidityToken.address}
                pair={pool?.pair}
                stakingData={pool?.staking}
                onClickMigrate={() => {
                  let container = {} as { [address: string]: { pair: Pair; staking: StakingInfo } }
                  container[pool?.pair?.liquidityToken.address] = pool
                  setSelectedPool(container)
                  toggleMigrationModal()
                }}
              />
            ))}
          </PanelWrapper>
        ) : (
          <EmptyProposals>
            <Text color="text3" textAlign="center" fontSize={24}>
              {t('pool.noLiquidity')}
            </Text>
          </EmptyProposals>
        )}

        {/* <Box display="flex" justifyContent="center" mt={30}>
          <ResponsiveButtonPrimary variant="primary" width="200px">
            {t('migratePage.seeMore')}
          </ResponsiveButtonPrimary>
        </Box> */}
      </Box>
      <MigrationModal selectedPool={selectedPool} version={params?.version} />
    </PageWrapper>
  )
}

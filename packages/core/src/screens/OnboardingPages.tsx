import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View, TouchableWithoutFeedback } from 'react-native'
import { SvgProps } from 'react-native-svg'

import CredentialList from '../assets/img/credential-list.svg'
import ScanShare from '../assets/img/scan-share.svg'
import Button, { ButtonType } from '../components/buttons/Button'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { GenericFn } from '../types/fn'
import { OnboardingStackParams, Screens } from '../types/navigators'
import { testIdWithKey } from '../utils/testable'

import { useTheme } from '../contexts/theme'

import { OnboardingStyleSheet } from './Onboarding'
import { ThemedText } from '../components/texts/ThemedText'

export const createCarouselStyle = (OnboardingTheme: any) => {
  return StyleSheet.create<OnboardingStyleSheet>({
    container: {
      ...OnboardingTheme.container,
      flex: 1,
      alignItems: 'center',
    },
    carouselContainer: {
      ...OnboardingTheme.carouselContainer,
      flexDirection: 'column',
    },
    pagerContainer: {
      flexShrink: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
    },
    pagerDot: {
      ...OnboardingTheme.pagerDot,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    pagerDotActive: {
      ...OnboardingTheme.pagerDotActive,
    },
    pagerDotInactive: {
      ...OnboardingTheme.pagerDotInactive,
    },
    pagerPosition: {
      position: 'relative',
      top: 0,
    },
    pagerNavigationButton: {
      ...OnboardingTheme.pagerNavigationButton,
    },
  })
}

export const createStyles = (OnboardingTheme: any) => {
  return StyleSheet.create({
    headerText: {
      ...OnboardingTheme.headerText,
    },
    bodyText: {
      ...OnboardingTheme.bodyText,
      flexShrink: 1,
    },
    point: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 20,
      marginTop: 10,
      marginRight: 20,
      marginBottom: 10,
    },
    icon: {
      marginRight: 10,
    },
  })
}

const createImageDisplayOptions = (OnboardingTheme: any) => {
  return {
    ...OnboardingTheme.imageDisplayOptions,
    height: 180,
    width: 180,
  }
}

const CustomPages = (onTutorialCompleted: GenericFn, OnboardingTheme: any) => {
  const { Assets } = useTheme()
  const { t } = useTranslation()
  const styles = createStyles(OnboardingTheme)
  const imageDisplayOptions = createImageDisplayOptions(OnboardingTheme)
  return (
    <>
      <ScrollView style={{ padding: 20 }}>
        <View style={{ alignItems: 'center' }}>
          <Assets.svg.secureImage {...imageDisplayOptions} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <ThemedText style={styles.headerText} testID={testIdWithKey('HeaderText')}>
            Ornare suspendisse sed nisi lacus
          </ThemedText>
          <ThemedText style={[styles.bodyText, { marginTop: 25 }]} testID={testIdWithKey('BodyText')}>
          Your privacy matters.{'\n\n'}With iCredy, your digital credentials are securely stored and shared only with
          your consent. We do not track, analyze, or store your interactions. {'\n\n'}You are in control—approve every use and share only the necessary
          information.
          </ThemedText>
        </View>
      </ScrollView>
      <View style={{ marginTop: 'auto', margin: 20 }}>
        <Button
          title={t('Global.GetStarted')}
          accessibilityLabel={t('Global.GetStarted')}
          testID={testIdWithKey('GetStarted')}
          onPress={onTutorialCompleted}
          buttonType={ButtonType.Primary}
        />
      </View>
    </>
  )
}

const guides: Array<{ image: React.FC<SvgProps>; title: string; body: string; devModeListener?: boolean }> = [
  {
    image: CredentialList,
    title: 'iCredy: Your Smart Digital Identity',
    body: 'Unlike traditional wallets, iCredy simplifies identity verification for both online and in-person interactions. Securely store and manage your digital credentials, ensuring seamless access to trusted services. \n\nExperience a hassle-free way to prove your identity with confidence, backed by the latest in secure digital technology.',
    devModeListener: true,
  },
  {
    image: ScanShare,
    title: 'Digital Credentials',
    body: 'Your identity, digitized and secured. \n\nDigital credentials replace traditional physical documents like certificates and permits, allowing you to securely store and share verified information with trusted services.\n\nWith iCredy, identity verification becomes faster and more reliable, enabling seamless access to essential services.',
  },
]

export const createPageWith = (
  PageImage: React.FC<SvgProps>,
  title: string,
  body: string,
  OnboardingTheme: any,
  devModeListener?: boolean,
  onDevModeTouched?: () => void
) => {
  const styles = createStyles(OnboardingTheme)
  const imageDisplayOptions = createImageDisplayOptions(OnboardingTheme)
  const titleElement = (
    <ThemedText style={styles.headerText} testID={testIdWithKey('HeaderText')}>
      {title}
    </ThemedText>
  )
  return (
    <ScrollView style={{ padding: 20 }}>
      <View style={{ alignItems: 'center' }}>{<PageImage style={imageDisplayOptions} />}</View>
      <View style={{ marginBottom: 20 }}>
        {devModeListener ? (
          <TouchableWithoutFeedback testID={testIdWithKey('DeveloperModeTouch')} onPress={onDevModeTouched}>
            {titleElement}
          </TouchableWithoutFeedback>
        ) : (
          titleElement
        )}
        <ThemedText style={[styles.bodyText, { marginTop: 25 }]} testID={testIdWithKey('BodyText')}>
          {body}
        </ThemedText>
      </View>
    </ScrollView>
  )
}

const OnboardingPages = (onTutorialCompleted: GenericFn, OnboardingTheme: any): Array<Element> => {
  const navigation = useNavigation<StackNavigationProp<OnboardingStackParams>>()
  const [, dispatch] = useStore()
  const onDevModeEnabled = () => {
    dispatch({
      type: DispatchAction.ENABLE_DEVELOPER_MODE,
      payload: [true],
    })
    navigation.getParent()?.navigate(Screens.Developer)
  }
  const developerOptionCount = useRef(0)
  const touchCountToEnableBiometrics = 9

  const incrementDeveloperMenuCounter = () => {
    if (developerOptionCount.current >= touchCountToEnableBiometrics) {
      developerOptionCount.current = 0
      if (onDevModeEnabled) {
        onDevModeEnabled()
      }
      return
    }

    developerOptionCount.current = developerOptionCount.current + 1
  }
  return [
    ...guides.map((g) =>
      createPageWith(
        g.image,
        g.title,
        g.body,
        OnboardingTheme,
        g.devModeListener,
        g.devModeListener ? incrementDeveloperMenuCounter : undefined
      )
    ),
    CustomPages(onTutorialCompleted, OnboardingTheme),
  ]
}

export default OnboardingPages

import * as React from 'react'
import { ThemeProvider, useTheme } from 'emotion-theming'
import styled from '@emotion/styled'
import { css, Global } from '@emotion/core'
import { getScheme, SchemeKeyType, SchemeType } from '@themes/scheme'
import { useContextSchemeConfig } from '@themes/react'

import { SetupEmotionConfig, SetupEmotionResult, StyleFactory } from './types'

export function setupEmotion<
  ColorsSchemeKey extends SchemeKeyType,
  ColorsScheme extends SchemeType
>(
  config: SetupEmotionConfig<ColorsSchemeKey, ColorsScheme>,
): SetupEmotionResult<ColorsSchemeKey, ColorsScheme> {
  function useColors() {
    return useContextSchemeConfig(config.colors)
  }

  function useColorKey() {
    return React.useContext(config.colors.Context)
  }

  function ColorsConsumer({ children }: { children: (colors: ColorsScheme) => React.ReactNode }) {
    const Consumer = config.colors.Context.Consumer

    return (
      <Consumer>
        {(colorSchemeKey) => {
          const colors = getScheme(config.colors, colorSchemeKey)
          return children(colors)
        }}
      </Consumer>
    )
  }

  function ColorsProvider({
    value,
    children,
  }: {
    value: ColorsSchemeKey
    children: React.ReactNode
  }) {
    const Provider = config.colors.Context.Provider
    const colors = getScheme(config.colors, value)

    return (
      <Provider value={value}>
        <ThemeProvider theme={{ colors }}>{children}</ThemeProvider>
      </Provider>
    )
  }

  function globalStyle<EmotionTheme extends { colors: ColorsScheme }>(
    styleFactory: StyleFactory<EmotionTheme>,
  ) {
    return function GlobalStyle() {
      const theme = useTheme<EmotionTheme>()
      return <Global styles={css(styleFactory(theme))} />
    }
  }

  return {
    styled,
    globalStyle,
    useColors,
    useColorKey,
    ColorsConsumer,
    ColorsProvider,
  }
}

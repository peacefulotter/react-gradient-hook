[![License:MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![npm](https://img.shields.io/npm/v/react-gradient-hook)
![Downloads](https://img.shields.io/github/downloads/peacefulotter/react-gradient-hook/total)
![GitHub last commit](https://img.shields.io/github/last-commit/peacefulotter/react-gradient-hook)
[![Netlify Status](https://api.netlify.com/api/v1/badges/48c9fde3-3471-4408-9f78-0528bc484cc1/deploy-status)](https://app.netlify.com/sites/react-gradient-hook/deploys)
![GitHub stars](https://img.shields.io/github/stars/peacefulotter/react-gradient-hook?style=social)

<div align="center">
    <h2>react-gradient-hook</h2>
  <p align="center">
    <img style='border-radius: 8px' src="./overview.png" alt="" width="850px" />
  </p>
</div>
<br />
<div>
  <h3 align="center">
    A react gradient hook for users to create custom gradients.  
  </h3>
  <ul style='margin-top: 10px'>
    <li><b>Typescript</b> support</li>
    <li>Both <b>Hook</b> and standalone <b>Component</b> available</li>
     <li>Highly customizable</li>
    <li>Lightweight: <b> <100 kB </b> </li>
    <li>Uses react-color for the color pickers</li>
  </ul>
</div>

<div>
  <p align="center">
    <a href="https://react-gradient-hook.netlify.app" target="_blank">
    Live playground here 🎨
    </a>
  </p>
</div>

## Examples
 - As a <b>hook</b>
```jsx harmony
const Component = (props) => {
  const [colors, gradient] = useGradient({options})
  ...
  return (
    { gradient }
  )
}
```

 - As a <b>Component</b>
```jsx harmony
const Component = (props) => {
  ...
  return (
    <Gradient {...options} />
  )
}
```


## Props

| Name | Type | Default Value | Required? | Description
|-|-|-|-|-
`defaultColors` | `TRGB[]` | <a href="#trgb">see here</a> | No | Array of default colors for the gradient
`onChange` | `(colors: TRGB[]) => void` | `undefined` | No | Function triggered when the gradient changes (different colors, a cursor is moved, ...)
`gradientOptions` | `GradientOptions` | <a href="#gradientoptions">see here</a> | No | Options to change the way the gradient is displayed
`cursorOptions` | `CursorOptions` | <a href="#cursoroptions">see here</a> | No | Options to control the behavior of the cursors (i.e. colors on the gradient)
`pickerOptions` | `PickerOptions` | <a href="#pickeroptions">see here</a> | No | Options to control the color pickers under the gradient

## Types 

### TRGB
| Name | Type | Required? | Description
|-|-|-|-|-
| `r` | `number` | Yes | Red value 
| `g` | `number` | Yes | Green value 
| `b` | `number` | Yes | Blue value 
| `t` | `number` | Yes | Position on the gradient (from 0 to 1 included) 

### GradientOptions
| Name | Type | Default Value | Required? | Description
|-|-|-|-|-
| `height` | `number` | `45` | Yes | Gradient's height in pixels

### CursorOptions
| Name | Type | Default Value | Required? | Description
|-|-|-|-|-
| `width` | `number` | `15` | No | -
| `border` | `number` | `4` | No | -
| `shadow` | `number` | `2` | No | -
| `scale` | `number` | `1` | No | -
| `grid` | `boolean` | `false` | No | -
| `samples` | `number` | `20` | No | Number of steps the cursors can take. <b>Only works</b> if `grid` is set to `true`


### PickerOptions
| Name | Type | Default Value | Required? | Description
|-|-|-|-|-
| `showHue` | `boolean` | `true` | No | -
| `showChrome` | `boolean` | `true` | No | -
| `showCircles` | `boolean` | `true` | No | -
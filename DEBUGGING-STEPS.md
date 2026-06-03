# Debugging Scheme Name Auto-Population

## If the scheme name is NOT auto-populating, follow these steps:

### 1. Check Browser Console for Errors
Open DevTools (F12) and look for any React errors or warnings.

### 2. Verify Navigation State
On the Registration page, open Console and type:
```javascript
console.log(window.history.state)
```
**Expected:** You should see something like `{ usr: { schemeName: "Fund of Funds" } }`
**If empty:** The navigation state is not being passed correctly.

### 3. Check Redux State
In the Eligibility Results page, open Console and type:
```javascript
// Check if scheme is in Redux
console.log(JSON.parse(localStorage.getItem('persist:root')))
```
Look for the `eligibilityQuestioner` state and verify the `scheme` field has a value.

### 4. Add Debug Logs
Temporarily add console.logs to verify the flow:

**In EligibilityResultsComponent.tsx (line ~127):**
```typescript
onClick={() => {
    console.log('Navigating with scheme:', scheme);
    navigate('/signup', { state: { schemeName: scheme } })
}}
```

**In SignUpComponent.tsx (after the useEffect):**
```typescript
useEffect(() => {
    const navigationState = location.state as { schemeName?: string } | null;
    console.log('Navigation state received:', navigationState);
    console.log('Scheme name:', navigationState?.schemeName);
    if (navigationState?.schemeName) {
        const schemeName = navigationState.schemeName;
        console.log('Setting scheme name to:', schemeName);
        setValue('schemeName', schemeName, { shouldValidate: true });
        setFormData(prev => ({ ...prev, schemeName }));
    }
}, [location.state, setValue]);
```

### 5. Verify the Build
Make sure the changes were compiled:
- Stop the dev server (Ctrl+C)
- Restart it: `npm run dev`
- Hard refresh the browser (Ctrl+Shift+R or Ctrl+F5)

### 6. Check React Router Version
The code uses React Router v6 syntax. Verify your package.json has:
```json
"react-router-dom": "^6.4.2"
```

### 7. Test Direct URL
Try manually going to the signup page to see if it loads properly:
```
http://localhost:3000/#/signup
```

## Common Issues:

### Issue 1: "scheme is undefined"
**Cause:** The eligibility questionnaire might not be setting the scheme properly.
**Solution:** Check `eligibiltyQuestionerSlice.ts` - verify the `schemName` action is being dispatched.

### Issue 2: "location.state is null"
**Cause:** The navigation might be losing state during routing.
**Solution:** Check if you're using HashRouter vs BrowserRouter. State should work with both, but verify your router setup in App.tsx.

### Issue 3: "Field is not updating"
**Cause:** React Hook Form might not be syncing with the state.
**Solution:** Make sure both `setValue` and `setFormData` are being called in the useEffect.

## Success Indicators:
✅ Console shows: "Navigation state received: { schemeName: 'Fund of Funds' }"
✅ Console shows: "Setting scheme name to: Fund of Funds"
✅ The Scheme Name field in the form is visibly populated
✅ No errors in the browser console
